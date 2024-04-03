import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { IconExtendInfoConfigs, ExtendInfoDataAttribution } from '@/config/ExtendInfoConfig'
import { parseGridKey, getGridKey } from '@/logic/board'

// TODO: ExtendInfoDataAttribution.kGrid 输出
export default class ExtendInfoProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    const extendInfo = level.extendInfo
    IconExtendInfoConfigs.forEach(config => {
      let data = gameDataAny[config.k]
      if (!config.noExport && data !== undefined) {
        if (config.dataAttribution === ExtendInfoDataAttribution.kGrid) {
          // 单格坐标加 r, c -1
          const newData: any = {}
          for (const key in data) {
            const rcs = parseGridKey(key)
            const newRcs = getGridKey(rcs.r - 1, rcs.c - 1, rcs.side)
            newData[newRcs] = data[key]
          }
          data = newData
        }
        if (config.parser) {
          extendInfo[config.k] = config.parser(data)
        } else {
          extendInfo[config.k] = data
        }
      }
    })
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const gameDataAny: any = rawData.gameData
    const extendInfo = level.extendInfo
    IconExtendInfoConfigs.forEach(config => {
      let data = extendInfo[config.k]
      if (!config.noExport && data !== undefined) {
        if (config.dataAttribution === ExtendInfoDataAttribution.kGrid) {
          // 单格坐标加 r, c +1
          const newData: any = {}
          for (const key in data) {
            const rcs = parseGridKey(key)
            const newRcs = getGridKey(rcs.r + 1, rcs.c + 1, rcs.side)
            newData[newRcs] = data[key]
          }
          data = newData
        }

        if (config.exporter) {
          gameDataAny[config.k] = config.exporter(data)
        } else {
          gameDataAny[config.k] = data
        }
      }
    })
  }
}
