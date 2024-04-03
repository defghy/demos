import LevelDataProcessor from './LevelDataProcessor'
import { RawLevelData } from '@/types/RawLevelData'
import { LevelState } from '@/store/level'
import CrossStrengthConfigProcessor from './CrossStrengthConfigProcessor'
import AddInfoConfigProcessor from './AddInfoConfigProcessor'
import ExtendInfoProcessor from './ExtendInfoProcessor'
import GourdNumsProcessor from './GourdNumsProcessor'
import GiftConfigProcessor from './GiftConfigProcessor'
import SquidConfigProcessor from './SquidConfigProcessor'
import WanShengConfigProcessor from './WanShengConfigProcessor'
import GyroDataConfigProcessor from './GyroDataConfigProcessor'
import LockBoxGlobalConfigProcessor from './LockBoxGlobalConfigProcessor'
import WaterBucketGlobalConfigProcessor from './WaterBucketGlobalConfigProcessor'
import BackSideTileMapConfigProcessor from './BackSideTileMapConfigProcessor'
import ModeExtraDataProcessor from './ModeExtraDataProcessor'
import SeaAnimalMapProcessor from './SeaAnimalMapProcessor'
import OrderListProcessor from './OrderListProcessor'
import SpawnQueueProcessor from './SpawnQueueProcessor'
import FuuuOrderListProcessor from './FuuuOrderListProcessor'
import TopHatRabbitConfigProcessor from './TopHatRabbitConfigProcessor'

const LEVEL_DATA_PROCESSORS: LevelDataProcessor[] = [
  new ExtendInfoProcessor(),
  new ModeExtraDataProcessor(),
  new OrderListProcessor(),
  new FuuuOrderListProcessor(),

  new CrossStrengthConfigProcessor(),
  new AddInfoConfigProcessor(),
  new SeaAnimalMapProcessor(),
  new BackSideTileMapConfigProcessor(),
  new GourdNumsProcessor(),
  new GiftConfigProcessor(),
  new SquidConfigProcessor(),
  new GyroDataConfigProcessor(),
  new WanShengConfigProcessor(),
  new LockBoxGlobalConfigProcessor(),
  new WaterBucketGlobalConfigProcessor(),
  new SpawnQueueProcessor(),
  new TopHatRabbitConfigProcessor(),
]

export class LevelDataProcessors {
  static parse(rawData: RawLevelData, level: LevelState): void {
    LEVEL_DATA_PROCESSORS.forEach(processor => processor.parse(rawData, level))
  }

  static export(level: LevelState, rawData: RawLevelData): void {
    LEVEL_DATA_PROCESSORS.forEach(processor => processor.export(level, rawData))
  }
}
