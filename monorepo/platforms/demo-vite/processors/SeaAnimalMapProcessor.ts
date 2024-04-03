import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState, GridState } from '@/store/level'
import { Icon, getMultipleGridIconConfigByMainIcon, MultipleGridIconStaticBindingGrid } from '@/config/IconConfig'
import { createIcon, getGridIcons } from '@/store/level/level-helper'
import { sparseArrayDeep } from '@/logic/util'

const SeaAnimalIconIdTypeMap: Record<number, number> = {
  [Icon.kPenguin]: 1,
  [Icon.kPenguinH]: 2,
  [Icon.kSeal]: 3,
  [Icon.kSealV]: 4,
  [Icon.kSeaBear]: 5,
  [Icon.kSea2x2]: 13,

  // 2016圣诞活动
  70060: 6,
  70061: 7,
  70062: 8,
  70063: 9,
  70067: 10,
}

const SeaAnimalTypeIconIdMap: Record<number, number> = {}
for (const key in SeaAnimalIconIdTypeMap) {
  const value = SeaAnimalIconIdTypeMap[key]
  SeaAnimalTypeIconIdMap[value] = parseInt(key, 0)
}

const SeaAnimalFlagIconIdTypeMap: Record<number, number> = {
  [Icon.kPenguinPlaceholder]: 1,
  [Icon.kSealPlaceholder]: 2,
  [Icon.kSeaBearPlaceholder]: 4,

  // 2016圣诞活动
  70064: 8,
  70065: 16,
  70066: 32,
  70068: 64,
}
const SeaAnimalFlagTypeIconIdMap: Record<number, number> = {}
for (const key in SeaAnimalFlagIconIdTypeMap) {
  const value = SeaAnimalFlagIconIdTypeMap[key]
  SeaAnimalFlagTypeIconIdMap[value] = parseInt(key, 0)
}

export function applySeaAnimalToGrid(grids: GridState[][], mainGrid: GridState, value: number) {
  const icon = SeaAnimalTypeIconIdMap[value]
  mainGrid.icons[icon] = createIcon(icon)
  const multiGridIconConfig = getMultipleGridIconConfigByMainIcon(icon)
  if (multiGridIconConfig) {
    const gridList = multiGridIconConfig.gridList
    if (gridList) {
      gridList.forEach(config => {
        const subConfig = config as MultipleGridIconStaticBindingGrid
        const subGrid = grids[mainGrid.r + subConfig.fixR][mainGrid.c + subConfig.fixC]
        subGrid.icons[subConfig.icon] = createIcon(subConfig.icon)
      })
    }
  }
}

export function applySeaAnimalFlagToGrid(grid: GridState, flags: number) {
  for (const key in SeaAnimalFlagTypeIconIdMap) {
    const bit = parseInt(key, 10)
    const icon = SeaAnimalFlagTypeIconIdMap[key]
    if ((flags & bit) > 0) {
      grid.icons[icon] = createIcon(icon)
    }
  }
}

function convertGridsToMap(grids: GridState[][], iconTypeMap: Record<number, any>) {
  const map: number[][] = []
  let count = 0
  grids.forEach((row, r) => {
    if (!map[r]) map[r] = []

    row.forEach((grid, c) => {
      const icons = getGridIcons(grid)

      icons.forEach(icon => {
        const type = iconTypeMap[icon.id]
        if (type) {
          map[r][c] = type
          count++
        }
      })
    })
  })
  return count > 0 ? map : null
}

export function generateSeaAnimalMap(grids: GridState[][]) {
  const map: number[][] = []
  let count = 0
  grids.forEach((row, r) => {
    if (!map[r]) map[r] = []

    row.forEach((grid, c) => {
      const icons = getGridIcons(grid)

      icons.forEach(icon => {
        const type = SeaAnimalIconIdTypeMap[icon.id]
        if (type) {
          map[r][c] = type
          count++
        }
      })
    })
  })
  return count > 0 ? map : null
}

export function generateSeaAnimalFlagMap(grids: GridState[][]) {
  const map: number[][] = []
  let count = 0
  grids.forEach((row, r) => {
    if (!map[r]) map[r] = []

    row.forEach((grid, c) => {
      const icons = getGridIcons(grid)

      let v = 0
      icons.forEach(icon => {
        const bit = SeaAnimalFlagIconIdTypeMap[icon.id]
        if (bit) {
          v += bit
          count++
        }
      })
      map[r][c] = v
    })
  })
  return count > 0 ? map : null
}

export default class SeaAnimalMapProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const seaAnimalMap = rawData.gameData.seaAnimalMap
    if (seaAnimalMap) {
      const grids = level.board.grids[0]
      grids.forEach((row, r) =>
        row.forEach((grid, c) => {
          const value = seaAnimalMap[r]?.[c]
          if (value) {
            applySeaAnimalToGrid(grids, grid, value)
          }
        })
      )
    }

    const seaFlagMap = rawData.gameData.seaFlagMap
    if (seaFlagMap) {
      const grids = level.board.grids[0]
      grids.forEach((row, r) =>
        row.forEach((grid, c) => {
          const value = seaFlagMap[r]?.[c]
          if (value) {
            applySeaAnimalFlagToGrid(grid, value)
          }
        })
      )
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const grids = level.board.grids[0]

    const seaAnimalMap = generateSeaAnimalMap(grids)
    if (seaAnimalMap) {
      rawData.gameData.seaAnimalMap = sparseArrayDeep(seaAnimalMap)
    }

    const seaAnimalFlagMap = generateSeaAnimalFlagMap(grids)
    if (seaAnimalFlagMap) {
      rawData.gameData.seaFlagMap = sparseArrayDeep(seaAnimalFlagMap)
    }
  }
}
