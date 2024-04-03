import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { ExtendDirectionPickerDirectionCount, ExtendDirectionCountMap } from '@/config/ExtendInfoConfig'
import { Tile } from '@/types/Tile'
import { getGridKey, parseGridKey } from '@/logic/board'
import { sparseArrayDeep } from '@/logic/util'

function parseColors(rawColor: string) {
  if (!rawColor) return []

  const colors = Array(6).fill(false)
  const rawColors = rawColor.split(':')

  rawColors.forEach(v => {
    const color = parseInt(v, 10) - 1
    colors[color] = true
  })
  return colors
}

function generateColors(colors: boolean[]) {
  if (!colors) return ''

  const result: number[] = []
  colors.forEach((color, index) => color && result.push(index + 1))
  return result.join(':')
}

function parseDirections(rawDirections: string, directionType: ExtendDirectionPickerDirectionCount) {
  if (!rawDirections) return []

  const rawDirectionsArr = rawDirections.split(':')
  const usedDirections = ExtendDirectionCountMap[directionType]
  return rawDirectionsArr.map(v => {
    const index = parseInt(v, 10)
    return usedDirections[index - 1]
  })
}

function generateDirections(directions: number[], directionType: ExtendDirectionPickerDirectionCount) {
  if (!directions) return ''

  const usedDirections = ExtendDirectionCountMap[directionType]
  return directions
    .map(v => {
      const index = usedDirections.indexOf(v)
      return index + 1
    })
    .join(':')
}

const AddInfoSubProcessorConfig: {
  /** ExtendInfo 中的 key */
  key: string
  /** 配置对应的 TileId */
  tileId: Tile
  /** 将 addInfoCfg 中的字符串转换为 ExtendInfo 中的数据 */
  parser: (data: string) => any
  /** 将  ExtendInfo 中的数据转换为 addInfoCfg 中的字符串 */
  exporter: (data: any) => string
}[] = [
  {
    // 大眼仔
    key: 'tile84',
    tileId: Tile.kMagicLamp,
    parser(data: string) {
      const arr = data.split('|')
      const colors = parseColors(arr[0])
      const directions = parseDirections(arr[1], ExtendDirectionPickerDirectionCount.kHorizontalVertical)
      return { colors, directions }
    },
    exporter(data: { colors: boolean[]; directions: number[] }) {
      const colors = generateColors(data.colors)
      const directions = generateDirections(data.directions, ExtendDirectionPickerDirectionCount.kHorizontalVertical)
      return `${colors}|${directions}`
    },
  },
  {
    // 水母宝宝
    key: 'tile199',
    tileId: Tile.kBlocker199,
    parser(data) {
      const arr = data.split('|')
      const colors = parseColors(arr[0])
      const directions: number[] = parseDirections(arr[1], ExtendDirectionPickerDirectionCount.kFourQuadrant)
      const level: number = arr[2] == undefined ? 3 : parseInt(arr[2].substring(1))
      return { colors, directions, level }
    },
    exporter(data: { colors: boolean[]; directions: number[]; level: number }) {
      const colors = generateColors(data.colors)
      const directions = generateDirections(data.directions, ExtendDirectionPickerDirectionCount.kFourQuadrant)
      const level = data.level.toString()
      return `${colors}|${directions}|L${level}`
    },
  },
  {
    // 过滤器
    key: 'tile201',
    tileId: Tile.kBlocker201,
    parser(data) {
      return { level: parseInt(data, 10) }
    },
    exporter(data: { level: number }) {
      return data.level.toString()
    },
  },
  {
    // 配对锁
    key: 'lockBoxGrid',
    tileId: Tile.kBlocker206,
    parser(data) {
      const arr = data.split('|')
      // 默认1
      const lockGroup = arr[0] ? parseInt(arr[0], 10) : 1
      const lockHead = arr[1] ? arr[1] !== '0' : false
      return { lockGroup, lockHead }
    },
    exporter(data: { lockGroup: number; lockHead: boolean }) {
      let str = data.lockGroup.toString()
      if (data.lockHead) {
        str += `|${data.lockHead ? 1 : ''}`
      }
      return str
    },
  },
  {
    // 寄居蟹
    key: 'tile211',
    tileId: Tile.kBlocker211,
    parser(data) {
      const arr = data.split('|')
      const colors = parseColors(arr[0])
      const count = arr[1] === '' ? undefined : parseInt(arr[1], 10)
      return { colors, count }
    },
    exporter(data: { colors: boolean[]; count: number }) {
      const colors = generateColors(data.colors)
      return `${colors}|${data.count || 0}`
    },
  },
  {
    // 水罐
    key: 'waterBucketGrid',
    tileId: Tile.kWaterBucket,
    parser(data) {
      const arr = data.split('|')
      return { group: parseInt(arr[0], 10) }
    },
    exporter(data: { group: number }) {
      return `${data.group}|||`
    },
  },
  {
    // 周赛2020宝石宝箱
    key: 'tile10016',
    tileId: 10016,
    parser(data) {
      const arr = data.split('|')
      return { value1: parseInt(arr[0], 10), value2: parseInt(arr[1], 10) }
    },
    exporter(data: { value1: number; value2: number }) {
      return `${data.value1}|${data.value2}||`
    },
  },
  {
    // 3x3生成数
    key: 'tile20001',
    tileId: 20001,
    parser(data) {
      const arr = data.split('|')
      return { value: parseInt(arr[0], 10) }
    },
    exporter(data: { value: number }) {
      return `${data.value}|||`
    },
  },
]

export default class AddInfoConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const addInfoConfig = rawData.gameData.addInfoCfg
    if (addInfoConfig) {
      const extendInfo = level.extendInfo
      addInfoConfig.forEach((config, side) => {
        if (!config) return
        config.forEach((row, r) => {
          if (!row) return
          row.forEach((item, c) => {
            if (item) {
              const info = this.parseAddInfo(item)

              AddInfoSubProcessorConfig.forEach(config => {
                const rawData = info[config.tileId]
                if (rawData) {
                  if (!extendInfo[config.key]) {
                    extendInfo[config.key] = {}
                  }
                  const rcs = getGridKey(r, c, side)
                  extendInfo[config.key][rcs] = config.parser(rawData)
                }
              })
            }
          })
        })
      })
    }
  }

  addToAddInfo(addInfo: GenericObject<string, string>[][], r: number, c: number, tile: Tile, data: string) {
    if (!addInfo[r]) addInfo[r] = []
    if (!addInfo[r][c]) addInfo[r][c] = {}
    addInfo[r][c][tile - 1] = data
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const addInfoMaps: GenericObject<string, string>[][][] = []

    AddInfoSubProcessorConfig.forEach(config => {
      const data = level.extendInfo[config.key]
      if (data) {
        Object.keys(data).forEach(key => {
          const rcs = parseGridKey(key)
          if (!addInfoMaps[rcs.side]) {
            addInfoMaps[rcs.side] = []
          }
          const value = config.exporter(data[key])
          this.addToAddInfo(addInfoMaps[rcs.side], rcs.r, rcs.c, config.tileId, value)
        })
      }
    })

    const exportMaps = addInfoMaps.map(addInfoMap => this.generateAddInfo(addInfoMap))
    rawData.gameData.addInfoCfg = sparseArrayDeep(exportMaps)
  }

  parseAddInfo(addInfo: string) {
    const result: GenericObject<string, string> = {}
    if (!addInfo) return result

    const arr = addInfo.split(';')
    arr.forEach(item => {
      const arr2 = item.split('=')
      if (arr2.length === 2) {
        const tile = parseInt(arr2[0], 10) + 1
        result[tile] = arr2[1]
      }
    })
    return result
  }

  generateAddInfo(addInfo: GenericObject<string, string>[][]): (string | null)[][] {
    return addInfo.map(row =>
      row.map(item =>
        Object.keys(item)
          .map(key => `${key}=${item[key]}`)
          .join(';')
      )
    )
  }
}
