import {GridPosition} from './grid-position';
import {GridSize} from './grid-size';
/**
 * GridItem object
 */
export class GridItem {

  /**
   * position of this item in grid
   * @type {GridPosition}
   */
  position?: GridPosition = new GridPosition();

  /**
   * size of this grid item
   * @type {GridItemSize}
   */
  size: GridSize = new GridSize();

  /**
   * value of this grid item
   */
  value?: any;

  constructor() {
    this.position = new GridPosition();
    this.size = new GridSize();
  }
}
