import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { ExtendIconListItem } from '@/config/ExtendInfoConfig'
import { GiftPropConfig } from '@/config/PropConfig'

export default class GiftConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    const gift = gameDataAny.gift
    if (gift) {
      let count = 0
      const extendInfo = level.extendInfo
      const gifts: any = {}
      for (const rc in gift) {
        const v = gift[rc]
        if (v === 'null') continue

        if (v === '') {
          // 正常关卡不会有空字符串，这里为了兼容已有的错误数据
          gifts[rc] = { items: [] }
          count++
          continue
        }

        const props: string[] = v.split(',')
        const levelItems: ExtendIconListItem[] = []
        props.forEach(prop => {
          const propArr = prop.split('_')
          const propConfig = GiftPropConfig.find(item => item.propId.toString() === propArr[0])
          if (propConfig) {
            levelItems.push({ iconId: propConfig.iconId, value: parseInt(propArr[1], 10) })
            count++
          }
        })
        gifts[rc] = { items: levelItems }
      }
      if (count > 0) extendInfo.gift = gifts
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const gifts = extendInfo.gift
    if (gifts && Object.keys(gifts).length > 0) {
      const gameDataAny: any = rawData.gameData
      gameDataAny.gift = {}
      for (const rc in gifts) {
        const v: ExtendIconListItem[] = gifts[rc].items
        gameDataAny.gift[rc] = v
          .map(item => {
            const propConfig = GiftPropConfig.find(prop => item.iconId === prop.iconId)
            if (propConfig) {
              return `${propConfig.propId}_${item.value}`
            } else {
              return ''
            }
          })
          .join(',')
      }
    }
  }
}
