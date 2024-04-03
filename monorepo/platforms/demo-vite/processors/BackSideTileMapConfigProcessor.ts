import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState, GridState, BoardState } from '@/store/level'
import { TempGridData } from '@/store/level/TempGridData'
import {
  parseSpeicalAnimalMapData,
  mapColorfulTileToIcon,
  mapCommonTileToIcons,
  applySpecialTile,
} from '../level-parser'
import { mapCrossStrengthConfigToIcon, generateCrossStrengthConfig } from './CrossStrengthConfigProcessor'
import { calcGridsIconCountMap } from '@/logic/board'
import { Icon } from '@/config/IconConfig'
import {
  generateTileMap1,
  generateAddTypesMap,
  generateTileMap2,
  generateAnimalSpecialMap,
  generateSpecialTypesMapBack,
  splitGrids,
} from '../level-exporter'
import { createArray2, sparseArrayDeep } from '@/logic/util'
import {
  generateSeaAnimalMap,
  generateSeaAnimalFlagMap,
  applySeaAnimalToGrid,
  applySeaAnimalFlagToGrid,
} from './SeaAnimalMapProcessor'
import { SeachIndexType, SeachIndexData, SearchTypePrivate } from '@/config/SeachIndexConfig'

export default class BackSideTileMapConfigProcessor implements LevelDataLevelDataProcessor {
  applyBackSideTileItem(board: BoardState, grid: GridState, item: string) {
    const r = grid.r
    const c = grid.c
    const [
      tileMapData,
      tileMap2Data,
      specialAnimalMapData,
      crossStrengthCfgData,
      tileAttrsCfgData,
      seaAnimalGridData,
      seaFlagGridData,
    ] = item.split(';')
    const tempGrid = new TempGridData(r, c)
    tempGrid.initWithRawData(tileMapData, tileMap2Data)
    const speicalAnimalData = parseSpeicalAnimalMapData(parseInt(specialAnimalMapData, 10))
    const icons = mapCommonTileToIcons(tempGrid)
    icons.forEach(icon => (grid.icons[icon.id] = icon))
    const colorfulIcon = mapColorfulTileToIcon(tempGrid, speicalAnimalData)
    if (colorfulIcon) {
      grid.icons[colorfulIcon.id] = colorfulIcon
    }
    const crossStrengthIcon = mapCrossStrengthConfigToIcon(crossStrengthCfgData === '0' ? 0 : crossStrengthCfgData)
    if (crossStrengthIcon) {
      grid.icons[crossStrengthIcon.id] = crossStrengthIcon
    }
    applySpecialTile(board, tempGrid)
    const seaAnimalValue = parseInt(seaAnimalGridData, 10)
    if (seaAnimalValue) {
      applySeaAnimalToGrid(board.grids[1], grid, seaAnimalValue)
    }
    const seaAnimalFlagValue = parseInt(seaFlagGridData, 10)
    if (seaAnimalFlagValue) {
      applySeaAnimalFlagToGrid(grid, seaAnimalFlagValue)
    }
  }

  parse(rawData: RawLevelData, level: LevelState): void {
    const backSideTileMap = rawData.gameData.backSideTileMap
    if (backSideTileMap) {
      const grids = level.board.grids[1]
      grids.forEach((row, r) =>
        row.forEach((grid, c) => {
          const value = backSideTileMap[r]?.[c]
          if (value) {
            this.applyBackSideTileItem(level.board, grid, value)
          }
        })
      )
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    // 不使用 hasIconOnBoard 保持导出不引用 LevelBoard
    const iconCountMap = calcGridsIconCountMap(level.board.grids[0])
    //包含双面翻转地格
    if (iconCountMap[Icon.kDoubleSideTurnTile]) {
      const backSide = level.board.grids[1]
      const { fixedGrids, digGrids } = splitGrids(level.mode, backSide, level.defaultRow, level.defaultCol)
      const addTypesMap = generateAddTypesMap(backSide)
      const specialTypesMap = generateSpecialTypesMapBack(level.board)
      //背面初始化格子
      generateTileMap1(fixedGrids, addTypesMap, true, SearchTypePrivate.KIncludeInBoardInitSide2)
      //挖地格子
      generateTileMap1(digGrids, addTypesMap, true, SearchTypePrivate.KIncludeInBoardDigSide2)
      //棋盘背面的所有格子
      const tileMap = generateTileMap1(backSide, addTypesMap)
      const tileMap2 = generateTileMap2(backSide, addTypesMap, specialTypesMap)

      //动物的特效信息
      const specialAnimalMap = generateAnimalSpecialMap(backSide)
      //精灵萌豆
      const crossStrengthCfg = generateCrossStrengthConfig(backSide)
      //海洋生物
      const seaAnimalMap = generateSeaAnimalMap(backSide)
      //海洋生物Flag
      const seaAnimalFlagMap = generateSeaAnimalFlagMap(backSide)

      const maps = [tileMap, tileMap2, specialAnimalMap, crossStrengthCfg, null, seaAnimalMap, seaAnimalFlagMap]

      const result: (string | null)[][] = createArray2(tileMap.length, tileMap[0].length, null)
      result.forEach((row, r) => {
        row.forEach((item, c) => {
          let count = 0
          const values = maps.map(map => {
            const item = map?.[r]?.[c]
            if (item && item !== '0') {
              count++
              return item
            } else {
              return 0
            }
          })
          if (count > 0) {
            result[r][c] = values.join(';')
          } else {
            result[r][c] = null
          }
        })
      })

      rawData.gameData.backSideTileMap = sparseArrayDeep(result)
    }
  }
}
