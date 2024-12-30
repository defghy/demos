import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { getIconConfigByIconId, getIconConfigByTileIdAndTag, IconTagType } from '@/config/IconConfig'
import { ExtendIconListItem } from '@/config/ExtendInfoConfig'
import { getReverseMap } from '@/logic/util'

const SpecialKeyIconMap: Record<number, number> = {
  100001: 10017,
  100002: 10037,
}

const IconSpecialKeyMap = getReverseMap(SpecialKeyIconMap)

export default class SquidConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    const squidConfig = gameDataAny.squidConfig
    if (squidConfig) {
      const data: any = {}
      let count = 0
      const extendInfo = level.extendInfo
      for (const rc in squidConfig) {
        const v = squidConfig[rc]
        if (v === null || v === 'null') continue

        const items: ExtendIconListItem[] = []
        const arr = v.split('_')
        let tile = parseInt(arr[0], 10)
        const value = parseInt(arr[1], 10)
        let iconConfig
        if (SpecialKeyIconMap[tile]) {
          iconConfig = getIconConfigByIconId(SpecialKeyIconMap[tile])
        } else {
          tile += 1
          iconConfig = getIconConfigByTileIdAndTag(tile, IconTagType.kCanCollectBySquid)
        }
        if (iconConfig) {
          items.push({ iconId: iconConfig.id, value: value })
          count++
        }
        data[rc] = { items }
      }

      if (count > 0) extendInfo.squidConfig = data
      else delete extendInfo.squidConfig
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const squidConfig = extendInfo.squidConfig

    if (squidConfig && Object.keys(squidConfig).length > 0) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.squidConfig = {}
      for (const rc in squidConfig) {
        const v: ExtendIconListItem[] = squidConfig[rc].items
        const v0 = v[0]
        if (v0) {
          if (IconSpecialKeyMap[v0.iconId]) {
            gameDataAny.squidConfig[rc] = `${IconSpecialKeyMap[v0.iconId]}_${v0.value}`
          } else {
            const iconConfig = getIconConfigByIconId(v0.iconId)
            gameDataAny.squidConfig[rc] = `${(iconConfig.tileId as number) - 1}_${v0.value}`
          }
        } else {
          gameDataAny.squidConfig[rc] = 'null'
        }
      }
    }
  }
}
