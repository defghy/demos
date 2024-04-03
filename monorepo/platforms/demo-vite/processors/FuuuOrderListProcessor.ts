import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { LevelState } from '@/store/level'
import { RawLevelData } from '@/types/RawLevelData'

function generateFuuuOrderList(list: { id: number; value: number }[]) {
  return list.map(order => {
    return { k: order.id, v: order.value }
  })
}

function parseRate(rate: any) {
  if (rate) {
    const fuuuNormalShadowRate = parseFloat(rate)
    if (!isNaN(fuuuNormalShadowRate)) {
      return fuuuNormalShadowRate
    }
  }
  return ''
}

export default class FuuuOrderListProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    level.fuuuOrders = []
    if (rawData.gameData.fuuuOrderList && rawData.gameData.fuuuOrderList.length) {
      for (const order of rawData.gameData.fuuuOrderList) {
        level.fuuuOrders.push({
          id: order.k,
          value: order.v,
        })
      }
    }

    level.fuuuNormalShadowRate = parseRate(rawData.gameData.fuuuNormalShadowRate)
  }

  export(level: LevelState, rawData: RawLevelData): void {
    if (level.fuuuOrders && level.fuuuOrders.length) {
      rawData.gameData.fuuuOrderList = generateFuuuOrderList(level.fuuuOrders)
    } else {
      delete rawData.gameData.fuuuOrderList
    }

    const fuuuNormalShadowRate =
      level.fuuuNormalShadowRate == undefined ? NaN : parseFloat(level.fuuuNormalShadowRate.toString())
    if (isNaN(fuuuNormalShadowRate)) {
      delete rawData.gameData.fuuuNormalShadowRate
    } else {
      rawData.gameData.fuuuNormalShadowRate = fuuuNormalShadowRate
    }
  }
}
