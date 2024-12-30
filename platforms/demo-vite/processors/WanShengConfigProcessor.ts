import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData, RawWanShengConfig } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import {
  getIconConfigByIconId,
  getIconConfigByTileIdAndSubType,
  getIconConfigByTileId,
  getIconConfigByColorAndAnimalType,
  Icon,
} from '@/config/IconConfig'
import { ExtendIconListItem, getExtendInfoConfigByKey } from '@/config/ExtendInfoConfig'
import { parseSpeicalAnimalMapData } from '../level-parser'
import { generateAnimalSpecialDefine, getExportedSubTypes } from '../level-exporter'
import { getGrid, getLegalGrid, parseGridKey } from '@/logic/board'
import { isExtendInfoTriggered } from '@/logic/extend-info/trigger'

interface WanShengExtendInfo {
  items: ExtendIconListItem[]
}

export default class WanShengConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameData = rawData.gameData
    const extendInfo = level.extendInfo

    // 全局配置
    const wanShengNormalConfig = gameData.wanShengNormalConfig
    if (wanShengNormalConfig) {
      extendInfo.wanShengNormalConfig = this.parseData(wanShengNormalConfig)
    }

    const wanShengConfig = gameData.wanShengConfig
    // 单格配置
    if (wanShengConfig) {
      const data: any = {}
      for (const key in wanShengConfig) {
        const v = wanShengConfig[key]
        const gridData = this.parseData(v)
        if (gridData) {
          data[key] = gridData
        }
      }
      extendInfo.wanShengConfig = data
    }

    // 生成口中的万生配置
    const dropConfig = gameData.wanShengDropConfig
    if (dropConfig) {
      const data: any = {}
      for (const key in dropConfig) {
        const v = dropConfig[key]
        const gridData = this.parseData(v)
        if (gridData) {
          data[key] = gridData
        }
      }
      extendInfo.wanShengDropConfig = data
    }
  }

  parseData(v: RawWanShengConfig) {
    if (!v.num || !v.mType) return null

    let iconConfig
    const tileId = v.mType + 1
    if (v.animalDef) {
      const animalDef = parseSpeicalAnimalMapData(v.animalDef)
      iconConfig = getIconConfigByColorAndAnimalType(tileId, animalDef.color, animalDef.special)
    } else if (v.attr) {
      iconConfig = getIconConfigByTileIdAndSubType(tileId, v.attr)
    } else {
      iconConfig = getIconConfigByTileId(tileId, v.subType)
    }
    if (iconConfig) {
      return { items: [{ iconId: iconConfig.id, value: v.num }] }
    } else {
      throw new Error(`找不到万能生成器配置对应的图标`)
    }
  }

  exportData(v: any) {
    if (v.items.length === 0) return

    const item: ExtendIconListItem = v.items[0]
    const config = getIconConfigByIconId(item.iconId)
    const data: RawWanShengConfig = {
      mType: (config.tileId as number) - 1,
      num: item.value,
      subType: config.subType,
    }
    // TODO 兼容旧编辑器代码，万生配置写入id字段，未来会移除，以 subType 判断
    if (data.mType == 135) {
      // 10110,10120,10130
      data.id = '101' + data.subType + '0'
    }

    const animalDef = generateAnimalSpecialDefine(item.iconId)
    if (animalDef !== 0) {
      data.animalDef = animalDef
    }
    const subType = getExportedSubTypes(config)
    if (subType) {
      data.attr = subType
    }
    return data
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const gameData = rawData.gameData
    const extendInfo = level.extendInfo

    const normalConfig = extendInfo.wanShengNormalConfig
    if (normalConfig && Object.keys(normalConfig).length > 0) {
      const data = this.exportData(normalConfig)
      if (data) {
        gameData.wanShengNormalConfig = data
      }
    }

    const wanShengConfig = extendInfo.wanShengConfig
    if (wanShengConfig && Object.keys(wanShengConfig).length > 0) {
      const data: GenericObject<string, RawWanShengConfig> = {}
      for (const key in wanShengConfig) {
        const rcs = parseGridKey(key)
        const grid = getGrid(rcs.r, rcs.c)
        // 只有格子上存在荷花包时才导出
        if (grid && grid.icons[Icon.kWansheng]) {
          const v = wanShengConfig[key]
          const gridData = this.exportData(v)
          if (gridData) {
            data[key] = gridData
          }
        }
      }
      gameData.wanShengConfig = data
    }

    const dropConfig = extendInfo.wanShengDropConfig
    if (dropConfig && Object.keys(dropConfig).length > 0) {
      const data: GenericObject<string, RawWanShengConfig> = {}
      const wanShengDropConfig = getExtendInfoConfigByKey('wanShengDropConfig')
      if (!wanShengDropConfig) {
        throw new Error(`找不到wanShengDropConfig的IconExtendInfoConfig`)
      }
      for (const key in dropConfig) {
        // 需要检查格子是否有荷花包的掉落规则（全局的或者单格的）
        const rcs = parseGridKey(key)
        const isTriggered = isExtendInfoTriggered(wanShengDropConfig, getLegalGrid(rcs.r, rcs.c))
        if (isTriggered) {
          const v = dropConfig[key]
          const gridData = this.exportData(v)
          if (gridData) {
            data[key] = gridData
          }
        }
      }
      if (Object.keys(data).length) {
        gameData.wanShengDropConfig = data
      }
    }
  }
}
