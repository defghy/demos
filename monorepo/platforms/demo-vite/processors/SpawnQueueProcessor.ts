import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData, RawSpawnQueueConfig, RawSpawnQueueItemConfig } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { parseGridKey, getGridKey } from '@/logic/board'
import IconConfig, { getIconConfigByIconId, Icon } from '@/config/IconConfig'
import { ExtendIconListItem } from '@/config/ExtendInfoConfig'
import { message } from 'ant-design-vue'
import { EditorModule } from '@/store/editor'
import { getGridIcon } from '@/store/level/level-helper'

/**
 * spawnQueueItems
 * v0 item 没有 count，每个对象表示一个
 * v1 item 有 count，是 v0 的去连续重复版本
 */

export default class SpawnQueueProcessor implements LevelDataLevelDataProcessor {
  getQueueItemIconConfig(queueItem: RawSpawnQueueItemConfig) {
    // 老的配置里面，mAnimalType和color没有也导出了
    // 先按 tileId 和 subType 筛
    // 再按 animalDef 筛
    let iconConfigs = IconConfig.filter(config => {
      if (queueItem.attr) {
        return queueItem.itemID === config.tileId && queueItem.attr === config.subType
      } else {
        return queueItem.itemID === config.tileId
      }
    })
    if (iconConfigs.length > 1) {
      iconConfigs = iconConfigs.filter(
        config => queueItem.mAnimalType === config.animalType && queueItem.colour === config.color
      )
    }

    let withoutAttr = false
    if (iconConfigs.length === 0) {
      iconConfigs = IconConfig.filter(config => queueItem.itemID === config.tileId)
      if (iconConfigs.length === 0) {
        throw new Error(`找不到生成口队列配置对应的图标`)
      } else {
        withoutAttr = true
        EditorModule.addParseLevelWarning(
          `生成口IconConfig[tileId=${queueItem.itemID}, subType=${queueItem.attr}] 未定义，已替换为 IconConfig[tileId=${queueItem.itemID}]`
        )
      }
    }
    if (iconConfigs.length > 1) {
      if (withoutAttr || !queueItem.attr) {
        EditorModule.addParseLevelWarning(
          `生成口IconConfig[tileId=${queueItem.itemID}] 有多个对应的图标,请检查attr属性,保存关卡`
        )
      } else {
        EditorModule.addParseLevelWarning(
          `生成口IconConfig[tileId=${queueItem.itemID}, subType=${queueItem.attr}] 有多个对应的图标,请检查attr属性,保存关卡`
        )
      }
    }
    return iconConfigs[0]
  }

  parseQueueItemsV0(queueItems: RawSpawnQueueItemConfig[]) {
    const result: ExtendIconListItem[] = []
    for (let i = 0; i < queueItems.length; i++) {
      const current = queueItems[i]
      const currentConfig = this.getQueueItemIconConfig(current)
      const currentItem = { iconId: currentConfig.id, value: 1 }
      result.push(currentItem)
      for (let j = i + 1; j < queueItems.length; j++) {
        const next = queueItems[j]
        const nextConfig = this.getQueueItemIconConfig(next)
        if (currentConfig.id === nextConfig.id) {
          currentItem.value++
          i = j
        } else {
          i = j - 1
          break
        }
      }
    }
    return result
  }

  parseQueueItemsV1(queueItems: RawSpawnQueueItemConfig[]) {
    return queueItems.map(item => {
      const config = this.getQueueItemIconConfig(item)
      return { iconId: config.id, value: item.count ?? 1 }
    })
  }

  parse(rawData: RawLevelData, level: LevelState): void {
    const spawnQueue = rawData.gameData.spawnQueue
    if (spawnQueue) {
      const spawnQueueVer = rawData.gameData.spawnQueueVer ?? 0
      level.extendInfo.spawnQueueVer = { value: !spawnQueueVer }

      const extendData: any = {}
      for (let s = 0; s < spawnQueue.length; s++) {
        const side = spawnQueue[s]
        for (const key in side) {
          const arr = key.split('_')
          const r = parseInt(arr[0], 10) - 1
          const c = parseInt(arr[1], 10) - 1
          const rcs = getGridKey(r, c, s)
          let queueItems
          if (spawnQueueVer === 0) {
            queueItems = this.parseQueueItemsV0(side[key].queueItems)
          } else if (spawnQueueVer === 1) {
            queueItems = this.parseQueueItemsV1(side[key].queueItems)
          } else {
            throw new Error(`未知的生成口队列版本 ${spawnQueueVer}`)
          }
          extendData[rcs] = { queueItems, cycleTimes: side[key].cycleTimes }
        }
      }

      level.extendInfo.spawnQueue = extendData
    } else {
      level.extendInfo.spawnQueue = {}
    }

    // 填充每个格子的默认值，防止用户点击格子时再创建数据，导致被编辑器认为修改了关卡
    level.board.grids.forEach((side, sideIndex) => {
      side.forEach(row => {
        row.forEach(grid => {
          const producer = getGridIcon(grid, Icon.kProducer)
          if (producer) {
            const rcs = getGridKey(grid.r, grid.c, sideIndex)
            if (!level.extendInfo.spawnQueue[rcs]) {
              // 如果生成口上没有配置生成口队列，则加一个默认的数据（导出时如果格子上是默认数据，会擦除）
              level.extendInfo.spawnQueue[rcs] = { queueItems: [], cycleTimes: 0 }
            }
          }
        })
      })
    })
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const extendData = extendInfo.spawnQueue
    if (extendData) {
      const spawnQueue: Record<string, RawSpawnQueueConfig>[] = []
      for (const key in extendData) {
        const v = extendData[key]
        const rcs = parseGridKey(key)
        const saveKey = `${rcs.r + 1}_${rcs.c + 1}`
        if (!spawnQueue[rcs.side]) {
          spawnQueue[rcs.side] = {}
        }
        if (v.queueItems.length > 0) {
          let queueItems: RawSpawnQueueItemConfig[] = v.queueItems
            .filter((v: ExtendIconListItem) => v.value > 0)
            .map((v: ExtendIconListItem) => {
              const config = getIconConfigByIconId(v.iconId)
              const item: RawSpawnQueueItemConfig = {
                itemID: config.tileId as number,
                colour: config.color ?? 0,
                mAnimalType: config.animalType ?? 0,
              }
              if (v.value > 1) item.count = v.value
              if (config.subType) item.attr = config.subType
              return item
            })
          if (extendInfo.spawnQueueVer.value) {
            queueItems = this.convertQueueItemsToV0(queueItems)
          } else {
            rawData.gameData.spawnQueueVer = 1
          }

          spawnQueue[rcs.side][saveKey] = {
            queueItems,
            cycleTimes: v.cycleTimes,
          }
        }
      }

      if (JSON.stringify(spawnQueue) != '[{}]') {
        rawData.gameData.spawnQueue = spawnQueue
      }
    }
  }

  convertQueueItemsToV0(queueItems: RawSpawnQueueItemConfig[]) {
    const result: RawSpawnQueueItemConfig[] = []
    queueItems.forEach(item => {
      if (item.count) {
        for (let i = 0; i < item.count; i++) {
          const newItem = { ...item }
          delete newItem.count
          result.push(newItem)
        }
      } else {
        result.push(item)
      }
    })
    return result
  }
}
