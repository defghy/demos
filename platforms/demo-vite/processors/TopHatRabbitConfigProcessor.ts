import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { getIconConfigByIconId, getIconConfigByTileIdAndTag, IconTagType } from '@/config/IconConfig'
import { ExtendIconListItem } from '@/config/ExtendInfoConfig'
import { getReverseMap } from '@/logic/util'
import { parseGridKey, getGridKey } from '@/logic/board'

const SpecialKeyIconMap: Record<number, number> = {
  100001: 10017, //横线
  100002: 10027, //竖线
  100003: 10037, //爆炸
  100004: 20005, //魔力鸟
}

const IconSpecialKeyMap = getReverseMap(SpecialKeyIconMap)

export default class TopHatRabbitConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    const topHatRabbitConfig = gameDataAny.topHatRabbitConfig
    if (topHatRabbitConfig) {
      const data: any = {}
      let count = 0
      const extendInfo = level.extendInfo
      for (const rc in topHatRabbitConfig) {
        const v = topHatRabbitConfig[rc]
        if (v === null || v === 'null') continue

        const dataSet: any = {}
        dataSet.initHP = v.initHP

        const releaseQueue: ExtendIconListItem[] = []
        if (v.releaseQueue) {
          const configReleaseQueue: number[] = v.releaseQueue
          if (configReleaseQueue && configReleaseQueue.length > 0) {
            configReleaseQueue.forEach(queueItem => {
              let iconConfig
              if (SpecialKeyIconMap[queueItem]) {
                iconConfig = getIconConfigByIconId(SpecialKeyIconMap[queueItem])
              }
              if (iconConfig) {
                releaseQueue.push({ iconId: iconConfig.id, value: 0 })
              }
            })
          }
        }
        dataSet.releaseQueue = releaseQueue

        const specialWeight: ExtendIconListItem[] = []
        if (v.specialWeight) {
          const configSpecialWeight: string[] = v.specialWeight
          if (configSpecialWeight && configSpecialWeight.length > 0) {
            configSpecialWeight.forEach(weightItem => {
              const arr = weightItem.split('_')
              const tile = parseInt(arr[0], 10)
              const value = parseInt(arr[1], 10)
              let iconConfig
              if (SpecialKeyIconMap[tile]) {
                iconConfig = getIconConfigByIconId(SpecialKeyIconMap[tile])
              }
              if (iconConfig) {
                specialWeight.push({ iconId: iconConfig.id, value: value })
              }
            })
          }
        }
        dataSet.specialWeight = specialWeight

        const rcs = parseGridKey(rc)
        const newRcs = getGridKey(rcs.r - 1, rcs.c - 1, rcs.side)
        data[newRcs] = dataSet
        count++
      }

      if (count > 0) extendInfo.topHatRabbitConfig = data
      else delete extendInfo.topHatRabbitConfig
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const topHatRabbitConfig = extendInfo.topHatRabbitConfig

    if (topHatRabbitConfig && Object.keys(topHatRabbitConfig).length > 0) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.topHatRabbitConfig = {}
      for (const rc in topHatRabbitConfig) {
        const initHP: number = topHatRabbitConfig[rc].initHP

        const releaseQueue: ExtendIconListItem[] = topHatRabbitConfig[rc].releaseQueue
        const formattedQueue: number[] = []
        if (releaseQueue && releaseQueue.length > 0) {
          releaseQueue.forEach(queueItem => {
            if (queueItem) {
              if (IconSpecialKeyMap[queueItem.iconId]) {
                formattedQueue.push(IconSpecialKeyMap[queueItem.iconId])
              }
            }
          })
        }

        const specialWeight: ExtendIconListItem[] = topHatRabbitConfig[rc].specialWeight
        const formattedWeight: string[] = []
        if (specialWeight && specialWeight.length > 0) {
          specialWeight.forEach(weightItem => {
            if (weightItem) {
              if (IconSpecialKeyMap[weightItem.iconId]) {
                const weightStr = `${IconSpecialKeyMap[weightItem.iconId]}_${weightItem.value}`
                formattedWeight.push(weightStr)
              }
            }
          })
        }

        const rcs = parseGridKey(rc)
        const newRcs = getGridKey(rcs.r + 1, rcs.c + 1, rcs.side)
        gameDataAny.topHatRabbitConfig[newRcs] = {}
        gameDataAny.topHatRabbitConfig[newRcs].initHP = initHP
        if (formattedQueue.length > 0) {
          gameDataAny.topHatRabbitConfig[newRcs].releaseQueue = formattedQueue
        }
        if (formattedWeight.length > 0) {
          gameDataAny.topHatRabbitConfig[newRcs].specialWeight = formattedWeight
        }
      }
    }
  }
}
