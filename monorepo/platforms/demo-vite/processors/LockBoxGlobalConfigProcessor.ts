import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import {
  ExtendKVObjectListItem,
  IconExtendInfoConfigs,
  ExtendKVObjectListConfig,
  ExtendKVListAutoShowConfig,
} from '@/config/ExtendInfoConfig'

const CONFIG = (IconExtendInfoConfigs.find(item => item.k === 'lockBoxGlobal')?.viewList[0] as ExtendKVObjectListConfig)
  .autoShowKVConfig?.[0] as ExtendKVListAutoShowConfig

export default class LockBoxGlobalConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    if (gameDataAny.tile205Cfg) {
      const extendInfo = level.extendInfo
      const config = Object.assign({}, ...gameDataAny.tile205Cfg)
      const items: ExtendKVObjectListItem[] = []
      for (const key in config) {
        const value = config[key]
        items.push({
          key: `${CONFIG?.keyHead}${key}`,
          triggerKey: key,
          value,
          config: CONFIG,
        })
      }

      extendInfo.lockBoxGlobal = {
        unlockConfigs: items,
      }
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const items = extendInfo.lockBoxGlobal?.unlockConfigs
    if (items) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.tile205Cfg = items.map((item: ExtendKVObjectListItem) => ({
        [item.triggerKey]: item.value,
      }))
    }
  }
}
