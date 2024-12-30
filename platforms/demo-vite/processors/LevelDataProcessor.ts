import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'

export default interface LevelDataProcessor {
  parse(rawData: RawLevelData, level: LevelState): void
  export(level: LevelState, rawData: RawLevelData): void
}
