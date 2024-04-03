import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData, RawKVListData } from '@/types/RawLevelData'
import { LevelState, LevelOrder, LevelModule } from '@/store/level'
import { LevelMode, isDigMode, UncertainTargetConfig } from '@/config/LevelModeConfig'
import { getLevelModeExtraData } from '@/logic/level'
import { DropdownModeExtraData, MayDayModeExtraData } from '@/types/mode'

export default class ModeExtraDataProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const mode = rawData.gameData.gameModeName as LevelMode
    const modeData = getLevelModeExtraData(mode)
    const gameData: any = rawData.gameData
    for (const key in modeData) {
      if (gameData[key]) {
        modeData[key] = gameData[key]
      }
    }
    switch (rawData.gameData.gameModeName) {
      case LevelMode.kDropDown: {
        const data: DropdownModeExtraData = modeData
        const v = rawData.gameData.ingredients?.[0]
        if (v !== undefined) {
          data.ingredients = v
        }
        if (level.productLogic == 3) {
          data.numIngredientsOnScreen = 0
        }
        break
      }
      case LevelMode.kMaydayEndless: {
        const data: MayDayModeExtraData = modeData
        if (rawData.gameData.uncertainCfg1) {
          const list1: LevelOrder[] = []
          rawData.gameData.uncertainCfg1.forEach(v => {
            const config = UncertainTargetConfig.find(item => v.k === item.key)
            if (config) {
              list1.push({ count: v.v, iconId: config.iconId })
            }
          })
          data.uncertainCfg1 = list1
        }
        if (rawData.gameData.uncertainCfg2) {
          const list2: LevelOrder[] = []
          rawData.gameData.uncertainCfg2.forEach(v => {
            const config = UncertainTargetConfig.find(item => v.k === item.key)
            if (config) {
              list2.push({ count: v.v, iconId: config.iconId })
            }
          })
          data.uncertainCfg2 = list2
        }
        break
      }
    }
    level.modeExtraData = modeData
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const modeData = level.modeExtraData
    const gameData: any = rawData.gameData
    if (modeData) {
      for (const key in modeData) {
        gameData[key] = modeData[key]
      }
    }
    switch (rawData.gameData.gameModeName) {
      case LevelMode.kDropDown: {
        const dropDownData: DropdownModeExtraData = modeData
        gameData.ingredients = [dropDownData.ingredients]
        if (level.productLogic == 3 && modeData.numIngredientsOnScreen != 0) {
          LevelModule.updateModeExtraData({ key: 'numIngredientsOnScreen', value: 0 })
        }
        break
      }
      case LevelMode.kMaydayEndless: {
        const data: MayDayModeExtraData = modeData
        const list1: RawKVListData[] = []
        data.uncertainCfg1.forEach(item => {
          const config = UncertainTargetConfig.find(v => v.iconId === item.iconId)
          config && list1.push({ k: config.key, v: item.count })
        })
        rawData.gameData.uncertainCfg1 = list1
        const list2: RawKVListData[] = []
        data.uncertainCfg2.forEach(item => {
          const config = UncertainTargetConfig.find(v => v.iconId === item.iconId)
          config && list2.push({ k: config.key, v: item.count })
        })
        rawData.gameData.uncertainCfg2 = list2
        break
      }
    }
  }
}
