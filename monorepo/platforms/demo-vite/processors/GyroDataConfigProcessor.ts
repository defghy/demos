import LevelDataLevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import { ExtendDirectionCountMap, ExtendDirectionPickerDirectionCount } from '@/config/ExtendInfoConfig'
import { parseGridKey } from '@/logic/board'

const DIRECTIONS = ExtendDirectionCountMap[ExtendDirectionPickerDirectionCount.kFourDir]

export default class GyroDataConfigProcessor implements LevelDataLevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void {
    const gameDataAny: any = rawData.gameData
    const gyroData = gameDataAny.gyroData
    if (gameDataAny.gyroData) {
      const extendData: any = {}
      for (const key in gyroData) {
        if (key === 'boardMinNum' || key === 'boardMaxNum') {
          extendData[key] = gyroData[key]
        } else {
          const v = gyroData[key]
          // TODO: v = 'r_c_面'
          const arr = key.split('_')
          const rc = `${arr[0]}_${arr[1]}`
          const directions: number[] = []
          v?.colourData.forEach((item: boolean, i: number) => item && directions.push(DIRECTIONS[i]))
          extendData[rc] = {
            ...v,
            colourData: directions,
          }
        }
      }
      level.extendInfo.gyroData = extendData
    }
  }

  export(level: LevelState, rawData: RawLevelData): void {
    const extendInfo = level.extendInfo
    const extendData = extendInfo.gyroData
    if (extendData) {
      const gyroData: any = {}
      for (const key in extendData) {
        if (key === 'boardMinNum' || key === 'boardMaxNum') {
          gyroData[key] = extendData[key]
        } else {
          const v = extendData[key]
          const directions: boolean[] = []
          v?.colourData?.forEach((item: number) => {
            const index = DIRECTIONS.indexOf(item)
            directions[index] = true
          })
          const colourData = [...directions].map(v => (v === undefined ? null : v))
          const rcs = parseGridKey(key)
          const saveKey = `${rcs.r}_${rcs.c}_${rcs.side + 1}`
          gyroData[saveKey] = {
            ...v,
            colourData,
          }
        }
      }
      const gameDataAny: any = rawData.gameData
      gameDataAny.gyroData = gyroData
    }
  }
}
