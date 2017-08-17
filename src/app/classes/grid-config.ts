/**
 * Grid Configuration object
 */
export class GridConfig {
  /**
   * number of rows for this grid
   * @type {number}
   */
  rows: number;
  /**
   * number of cols for this grid
   * @type {number}
   */
  cols: number;
  /**
   * height of each row of this grid
   * @type {number}
   */
  rowHeight?: number;

  constructor() {
    this.rows = 3;
    this.cols = 3;
    this.rowHeight = 80;
  }
}
