import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData, RawKVListData } from '@/types/RawLevelData'
import { LevelState, LevelOrder } from '@/store/level'
import {
  LevelMode,
  isOrderMode,
  getOrderTargetConfigByKey,
  getOrderTargetConfigByIconId,
} from '@/config/LevelModeConfig'
import { TargetIconMode } from '@/config/LegalityCheckConfig'
import { getLevelModeDefaultOrders } from '@/logic/level'

function parseOrderList(orderList: RawKVListData[]): LevelOrder[] {
  return orderList.map(order => {
    const targetConfig = getOrderTargetConfigByKey(order.k)
    return {
      iconId: targetConfig.iconId,
      count: order.v,
    }
  })
}

function generateOrderList(orders: LevelOrder[]): RawKVListData[] {
  return (
    orders
      // .filter(order => order.count > 0)  // 果酱为0
      .filter(order => order.mode !== TargetIconMode.kAutoCountExistenceAndAddOrRemoveTarget || order.count)
      .map(order => {
        const targetConfig = getOrderTargetConfigByIconId(order.iconId)
        return {
          k: targetConfig.key,
          v: order.count,
        }
      })
  )
}

export default class OrderListProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    if (isOrderMode(rawData.gameData.gameModeName as LevelMode) && rawData.gameData.orderList) {
      level.orders = parseOrderList(rawData.gameData.orderList)
    }

    // 将kAutoCountExistenceAndAddOrRemoveTarget类型的添加到列表中备用
    const defaultOrders = getLevelModeDefaultOrders(rawData.gameData.gameModeName as LevelMode)
    for (const order of defaultOrders) {
      if (order.mode === TargetIconMode.kAutoCountExistenceAndAddOrRemoveTarget) {
        if (!level.orders) {
          level.orders = []
        }
        if (!level.orders.find(o => o.iconId == order.iconId)) {
          level.orders.push(order)
        }
      }
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    if (isOrderMode(level.mode) && level.orders && level.orders.length > 0) {
      rawData.gameData.orderList = generateOrderList(level.orders)
    }
  }
}
