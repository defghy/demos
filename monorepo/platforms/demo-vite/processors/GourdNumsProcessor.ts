import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { getIconConfigByIconId, getIconConfigByTileIdAndSubType } from '@/config/IconConfig'
import { Tile } from '@/types/Tile'
import { ExtendIconListItem } from '@/config/ExtendInfoConfig'

export default class GourdNumsProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    if (gameDataAny.gourdNums) {
      const extendInfo = level.extendInfo
      const items = gameDataAny.gourdNums.map((item: GenericObject<string, number>) => {
        const subType = Object.keys(item)[0]
        const config = getIconConfigByTileIdAndSubType(Tile.kBlocker195, subType)
        if (config) {
          return { iconId: config.id, value: item[subType] }
        }
      })
      extendInfo.gourdNums = { items }
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const items = extendInfo.gourdNums?.items
    if (items) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.gourdNums = items.map((item: ExtendIconListItem) => {
        const config = getIconConfigByIconId(item.iconId)
        return { [config.subType as string]: item.value }
      })
    }
  }
}
