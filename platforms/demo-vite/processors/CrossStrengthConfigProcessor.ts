import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState, BoardState, GridState } from '@/store/level'
import { createIcon, getGridIcons } from '@/store/level/level-helper'

function parseFromCrossStrengthConfig(crossStrengthConfig: string) {
  const arr = crossStrengthConfig.split('_')
  const level = parseInt(arr[0])
  const color = parseInt(arr[1]) || 7
  return 10110 + level * 10 + color
}

export function mapCrossStrengthConfigToIcon(crossStrengthConfig: string | 0) {
  if (crossStrengthConfig === 0) return null

  const iconId = parseFromCrossStrengthConfig(crossStrengthConfig)
  return createIcon(iconId)
}

export function generateCrossStrengthConfig(grids: GridState[][]) {
  const crossStrengthConfig: (string | 0)[][] = []
  let count = 0
  grids.forEach((row, r) => {
    if (!crossStrengthConfig[r]) crossStrengthConfig[r] = []

    row.forEach((grid, c) => {
      const icons = getGridIcons(grid)

      icons.forEach(icon => {
        const iconId = icon.id
        //精灵萌豆
        if (iconId >= 10121 && iconId <= 10147) {
          const level = Math.floor((iconId - 10111) / 10)
          const color = iconId - 10110 - level * 10
          let str
          if (color === 7) {
            str = level.toString()
          } else {
            str = `${level}_${color}`
          }
          crossStrengthConfig[r][c] = str
          count++
        }
      })

      if (crossStrengthConfig[r][c] === undefined) {
        crossStrengthConfig[r][c] = 0
      }
    })
  })

  return count === 0 ? null : crossStrengthConfig
}

export default class CrossStrengthConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const crossStrengthConfig = rawData.gameData.crossStrengthCfg
    if (crossStrengthConfig && crossStrengthConfig.length) {
      const board = level.board
      const grids = board.grids[0]
      grids.forEach((row, r) =>
        row.forEach((grid, c) => {
          const value = crossStrengthConfig[r][c]
          const crossStrengthIcon = mapCrossStrengthConfigToIcon(value)
          if (crossStrengthIcon) {
            grid.icons[crossStrengthIcon.id] = crossStrengthIcon
          }
        })
      )
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const crossStrengthConfig = generateCrossStrengthConfig(level.board.grids[0])
    if (crossStrengthConfig) {
      rawData.gameData.crossStrengthCfg = crossStrengthConfig
    }
  }
}
