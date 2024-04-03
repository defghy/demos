import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import {
  ExtendKVObjectListItem,
  IconExtendInfoConfigs,
  ExtendKVObjectListConfig,
  ExtendKVListAutoShowConfig,
} from '@/config/ExtendInfoConfig'

const CONFIG = (IconExtendInfoConfigs.find(item => item.k === 'waterBucketCfg')
  ?.viewList[0] as ExtendKVObjectListConfig).autoShowKVConfig?.[0] as ExtendKVListAutoShowConfig

export default class WaterBucketGlobalConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const items: ExtendKVObjectListItem[] = []
    const gameDataAny: any = rawData.gameData
    if (gameDataAny.waterBucketCfg) {
      const config = Object.assign({}, ...gameDataAny.waterBucketCfg)
      for (const key in config) {
        const value = config[key]
        items.push({
          key: `${CONFIG?.keyHead}${key}`,
          triggerKey: key,
          value,
          config: CONFIG,
        })
      }
    }

    level.extendInfo.waterBucketCfg = {
      unlockConfigs: items,
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const items = extendInfo.waterBucketCfg?.unlockConfigs
    if (items && items.length) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.waterBucketCfg = items.map((item: ExtendKVObjectListItem) => ({
        [item.triggerKey]: item.value,
      }))
    }
  }
}
