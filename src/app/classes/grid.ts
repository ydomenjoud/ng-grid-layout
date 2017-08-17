import {GridConfig} from './grid-config';
import {GridItem} from './grid-item';
import {GridPosition} from './grid-position';
import {CellType} from '../enums/cell-type.enum';
import {GridSize} from './grid-size';

export class Grid {

  static error_overlap = 'cannot add grid item: overlap';

  movingItem: GridSize;

  private gridConfig: GridConfig;
  private gridItems: GridItem[];
  private gridCellsOccupation: boolean[][];
  private gridCellsHovered: boolean[][];

  constructor(config?: GridConfig) {
    this.gridItems = [];
    this.gridConfig = config || new GridConfig();
    this.gridCellsOccupation = [];
    this.gridCellsHovered = [];

    this.initConfig(config);
  }

  /**
   * init grid config
   * @param config
   * @return {GridConfig}
   */
  initConfig(config) {
    this.gridConfig = Object.assign(new GridConfig(), config);

    this.gridCellsOccupation = Array(this.config.rows);
    this.gridCellsHovered = Array(this.config.rows);

    for (let row = 0; row < this.config.rows; row++) {
      this.gridCellsOccupation[row] = Array(this.config.cols);
      this.gridCellsHovered[row] = Array(this.config.cols);

      for (let col = 0; col < this.config.cols; col++) {
        this.gridCellsOccupation[row][col] = false;
        this.gridCellsHovered[row][col] = false;
      }
    }

    return this.gridConfig;
  }

  /**
   * get grid config
   * @return {GridConfig}
   */
  get config() {
    return this.gridConfig;
  }

  /**
   * get grid items list
   * @return {GridItem[]}
   */
  get items() {
    return this.gridItems;
  }

  /**
   * get cells completion
   * @return {boolean[][]}
   */
  get cellsOccupated() {
    return this.gridCellsOccupation;
  }

  /**
   * return cells type
   * @return {CellType[][]}
   */
  get cells() {
    const state: CellType[][] = Array(this.config.rows);

    for (let row = 0; row < this.config.rows; row++) {
      state[row] = Array(this.config.cols);
      for (let col = 0; col < this.config.cols; col++) {
        if (this.gridCellsHovered[row] && this.gridCellsHovered[row][col]) {
          state[row][col] = CellType.Hovered;
        } else if (this.gridCellsOccupation[row][col]) {
          state[row][col] = CellType.Occupated;
        } else {
          state[row][col] = CellType.Empty;
        }
      }
    }

    return state;
  }

  /**
   * add row to the grid
   */
  addRow() {
    console.log(this.config)
    this.config.rows = this.config.rows+1;
    console.log(this.config)
    const copy = [...this.gridItems].map(item => ({...item}))
    this.initConfig(this.config);

    this.gridItems = copy;
  }

  /**
   * add new item to items list
   * @param item
   */
  addItem(item: GridItem) {
    this.unHoverGrid();
    if (!this.isItemSpotAvailable(item)) {
      throw new Error(Grid.error_overlap);
    }
    this.reserveItemSpot(item);
    this.gridItems.push(item);
  }

  /**
   * empty position
   * @param {GridItem} item
   */
  removeItem(item: GridItem) {
    this.gridItems.splice(this.gridItems.indexOf(item), 1);
    this.emptyPositions(this.getPositionsListForItemSpot(item));
  }

  /**
   * is this position in grid
   * @param position
   * @return {boolean}
   */
  isInGrid(position: GridPosition) {
    return position.row < this.config.rows && position.col < this.config.cols;
  }

  /**
   * get all positions for an item
   * @param item
   * @return {GridPosition[]}
   */
  getPositionsListForItemSpot(item: GridItem) {

    const positionsList: GridPosition[] = [];

    // for each rows of item
    for (let row = 0; row < item.size.rows; row++) {
      // for each cols of item
      for (let col = 0; col < item.size.cols; col++) {

        // current position
        const currentPosition: GridPosition = {
          row: item.position.row + row,
          col: item.position.col + col
        };

        positionsList.push(currentPosition);
      }
    }

    return positionsList;
  }

  /**
   * set theses cells as reserved in grid
   * @param positions
   */
  reservePositions(positions: GridPosition[]) {
    positions.forEach(position => {
      this.gridCellsOccupation[position.row][position.col] = true;
    });
  }

  /**
   * set theses cells as hovered in grid
   * @param positions
   */
  hoverPositions(positions: GridPosition[]) {
    if (!this.gridCellsHovered) {
      return;
    }

    this.unHoverGrid();

    positions.forEach(position => {
      if (this.gridCellsHovered[position.row]) {
        this.gridCellsHovered[position.row][position.col] = true;
      }
    });
  }

  /**
   * set theses cells as empty in grid
   * @param positions
   */
  emptyPositions(positions: GridPosition[]) {
    positions.forEach(position => {
      this.gridCellsOccupation[position.row][position.col] = false;
      this.gridCellsHovered[position.row][position.col] = false;
    });
  }

  /**
   * unhover positions
   * @param {GridPosition[]} positions
   */
  private unHoverPositions(positions: GridPosition[]) {
    positions.forEach(position => {
      this.gridCellsHovered[position.row][position.col] = false;
    });
  }

  /**
   * Empty all grid
   */
  unHoverGrid() {
    this.unHoverPositions(this.getPositionsListForItemSpot({
      position: {row: 0, col: 0},
      size: {cols: this.config.cols, rows: this.config.rows}
    }));
  }

  /**
   * reserve item position in grid
   * @param item
   */
  reserveItemSpot(item: GridItem) {
    this.reservePositions(this.getPositionsListForItemSpot(item));
  }

  /**
   * is that position empty ?
   * @param position
   * @return {boolean}
   */
  isPositionAvailable(position: GridPosition) {
    return this.cellsOccupated[position.row][position.col] === false;
  }

  /**
   * is that item available to add item
   * @param item
   * @return {boolean}
   */
  isItemSpotAvailable(item: GridItem) {
    return this.getPositionsListForItemSpot(item).every((position: GridPosition) => {
      return this.isInGrid(position) && this.isPositionAvailable(position);
    });
  }

  /**
   * get cell type
   * @param {GridPosition} position
   */
  cellType(position: GridPosition) {
    let type = 'empty';

    if (!this.cells || !this.cells[position.row] || !this.cells[position.row][position.col]) {
      return type;
    }

    switch (this.cells[position.row][position.col]) {
      case CellType.Occupated:
        type = 'occupated';
        break;
      case CellType.Hovered:
        type = 'hovered';
        break;
    }

    return type;
  }

  /**
   * hover item position in grid
   * @param item
   */
  hoverItemSpot(item: GridItem) {
    this.hoverPositions(this.getPositionsListForItemSpot(item));
  }

}

