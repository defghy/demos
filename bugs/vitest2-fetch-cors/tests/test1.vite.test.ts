import { expect, test, beforeAll, describe, afterAll, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import fsp from 'fs/promises'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import PQueue from 'p-queue'
import { cloneDeep } from 'lodash-es'

import { waitTime } from '@aweb/pkg-common'
import { sendFeishu, getLevelDetail, compareTwoObj } from '@aweb/pkg-test'
import { initStore, BoardModule } from '@/stores'
import { LevelModule } from '@/store/level'
import { loadLevelByLevelDetailData } from '@/logic/level'
import { exportGameData } from '@/logic/level-data/level-exporter-ubf'
import { fixLevelData } from '@/logic/level-data/level-fixer'
import { RawLevelData } from '@/types'
import { globalContext } from '@/utils/global'
import '@/logic/plugins'

import { ubfProcessor } from './ubf/utils'
import levelInfos from './ubf/levelList.json'

const ubfPath = path.resolve(dirname(fileURLToPath(import.meta.url)), './ubf')
global.nodeFetch = global.fetch

// 对比目标关卡的ubf与当前分支导出的ubf的区别
describe('compareLoongUbf', async () => {
  // 初始化环境
  beforeAll(async () => {
    window.structuredClone = window.structuredClone || cloneDeep
    globalContext.isTestMode = true
  })
  beforeEach(() => {
    setActivePinia(createPinia())
    initStore()
  })

  // 测试结束：测试结果发布
  let totalDiff = [] as any[]
  const queue = new PQueue({ concurrency: 20 })
  afterAll(async () => {
    // 全执行完
    const diffP0 = totalDiff.filter(item => item.p0.length)
    const diffP1 = totalDiff.filter(item => !item.p0.length && item.p1.length)
    const apiErrs = totalDiff.filter(item => !!item.apiErr)
    const content = `
      ${JSON.stringify(diffP0, null, 2)}
      ${JSON.stringify(diffP1, null, 2)}
    `

    if (diffP0.length) {
      await sendFeishu({
        content: JSON.stringify(diffP0.map(item => ({ ...item, p1: undefined }))).slice(0, 50000),
        title: 'ale测试不通过',
        sendToChatGroup: ['ale开发群'],
        // receiver: ['yu.hu'],
      })
      console.log('对比失败列表', diffP0)
    }
    if (apiErrs.length > 300) {
      await sendFeishu({
        content: `共${apiErrs.length}个关卡接口调用失败，原因：${apiErrs[0].apiErr}`,
        title: 'ale测试不通过',
        sendToChatGroup: ['ale开发群'],
        // receiver: ['yu.hu'],
      })
    }
    if (diffP0.length || diffP1.length) {
      fsp.writeFile(path.resolve(ubfPath, './test.result'), content, { flag: 'w' })
    }
  })

  // 随机选取一些线上关卡进行测试
  levelInfos
    .filter((item, index) => index <= 1)
    // .filter((item, index) => [1950].includes(item.id))
    .forEach(level => {
      test.concurrent(`关卡 ${level.id || level.uuid} ubf数据比对`, async () => {
        const currDiff = await diffLevel(level)
        totalDiff.push(currDiff)
        expect(currDiff!.p0.length).lessThanOrEqual(0)
      })
    })
})

const diffLevel = async function (level: { id: number; uuid: number; group: string }) {
  const id = level.id || level.uuid
  const currDiff = { id, p0: [] as any[], p1: [] as any[], apiErr: null, updateTime: '' }

  let levelData: RawLevelData
  try {
    levelData = await getLevelDetail({ id, group: level.group })
    currDiff.updateTime = levelData.updateTime
  } catch (e: any) {
    console.error(`关卡${id}详情请求失败，不进行diff`, e.message)
    currDiff.apiErr = e.message
    return currDiff
  }

  // 同步diff
  try {
    loadLevelByLevelDetailData(levelData as any)
    // 清理脏数据
    fixLevelData()
    let currUbf = exportGameData(LevelModule, { eachBoard: BoardModule.eachBoard })
    // 保存时会序列化，数组中的empty会变成null
    currUbf = JSON.parse(JSON.stringify(currUbf))

    // 错误等级，决定是否上报
    const makeErrLevel = function ({ path, origin, curr }: { path: string; origin: any; curr: any }) {
      const isEmpty = val => !val || (Array.isArray(val) && !val.length)
      // 都是空值
      if (isEmpty(origin) && isEmpty(curr)) {
        return 1
      }
      // 新增的属性
      if (path.endsWith('itemGlobal.adverSkinConfig') && origin === undefined) {
        return 2
      }
      // 老关卡这里存的0
      if (['levelInfo.levelId', 'levelInfo.levelType'].includes(path) && origin === 0) {
        return 1
      }
      // 遗留数据，和ale老代码效果一致
      if (['.ruleRef', '.blockFalling', '.portalId'].find(end => path.endsWith(end))) {
        return 1
      }
      // 生成口重新生成
      if (path.includes('productContext.rules')) {
        if (origin?.arrangers && !curr) {
          return 1
        }
        // 三个月前代码效果一样
        if (path.includes('checkItemType.fieldCond')) {
          return 1
        }

        // 删除无效icon时，影响到了productContext
        if (
          [
            2693, 2738, 1950, 2662, 2712, 2735, 2740, 2753, 2772, 2805, 2810, 2812, 2831, 2848, 2875, 2885, 2936, 2953,
            2978, 2987, 3053, 3078, 3082, 3083, 3118, 3144, 3145, 3240, 3278, 4515, 10070, 10257, 10258, 10260, 10278,
            10333, 10567, 10633, 10653, 380013, 381013, 382007,
          ].includes(id)
        ) {
          if (new Date(levelData.updateTime) < new Date('2024-07-19 00:00:00')) {
            return 1
          }
        }
        if ([2761, 3391].includes(id)) {
          if (new Date(levelData.updateTime) < new Date('2024-09-06 00:00:00')) {
            return 1
          }
        }
      }
      // 老棋盘保存为新棋盘
      if (levelData.gameData && !levelData.gameLoong) {
        // 约束配置，uuidVersion无用 忽略
        if (['multiBoardCreateData', 'levelInfo.uuidVersion'].find(keyword => path.includes(keyword))) {
          return 2
        }
        if (LevelModule.mode === 'siege') {
          // 老攻城棋盘进行了数据清洗，这些diff符合预期
          if (path.startsWith('boardContextCreateData.1')) {
            if (
              [
                'gameModeName', // 老的叫Order
                'productContext', // 生成的攻城棋盘没有生成口，没有
                'itemGlobal.pairingLockConfig', // 没有这个icon
                'itemGlobal.haystackGlobalConfig', // 没有这个icon
              ].find(keyword => path.includes(keyword))
            ) {
              return 1
            }
          }
        }
        // 老棋盘脏数据
        else if (level.id === 2885 && path.includes('featureMap.Puffer')) {
          return 2
        }
      }

      return 0
    }
    const difference = compareTwoObj(levelData.ubfGameData, currUbf, ubfProcessor)
    difference.forEach(diff => {
      const path = diff.path
      const origin = diff.value1
      const curr = diff.value2
      const myDiff = { path, origin, curr }

      // 不重要的diff
      const errLvl = makeErrLevel({ ...myDiff })

      if (errLvl === 0) {
        // 需要关注的diff
        currDiff.p0.push(myDiff)
      } else if (errLvl === 1) {
        currDiff.p1.push(myDiff)
      }
    })
  } catch (e: any) {
    currDiff.p0.push({ message: e.message, type: '代码未捕获错误' })
    return currDiff
  }

  return currDiff
}
