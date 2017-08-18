import {GridConfig} from './grid-config';
import {GridItem} from './grid-item';
import {GridPosition} from './grid-position';
import {CellType} from '../enums/cell-type.enum';
import {GridSize} from './grid-size';

export class Grid {

  static error_overlap = 'cannot add grid item: overlap';

  movingItem: GridItem;

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
  addRows(count = 1) {

    this.config.rows += count;
    for (let i = 0; i < count; i++) {
      this.gridCellsOccupation.push(Array(this.config.cols).fill(false));
      this.gridCellsHovered.push(Array(this.config.cols).fill(false));
    }
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

    // // if movingItem has a previous position
    if (this.movingItem.position) {
      // console.log('has position ', this.movingItem.position);
      // console.log('position ', this.gridItems, this.movingItem);

      this.moveItem(this.movingItem, item.position);

    }  else {
      this.gridItems.push(item);
    }


    // console.table(this.gridItems);

    this.reserveItemSpot(item);

    // console.table(this.cellsOccupated);

    // reset occupation
    this.emptyGrid();
    this.gridItems.forEach(gridItem => {
      this.reserveItemSpot(gridItem);
    });
    // console.table(this.cellsOccupated);

    // clean moving item
    this.movingItem = null;
  }

  /**
   * empty position
   * @param {GridItem} item
   */
  removeItem(item: GridItem) {

    const index = this.gridItems.findIndex(elt => {
      return elt.position.row === this.movingItem.position.row
        && elt.position.col === this.movingItem.position.col
        && elt.size.cols === this.movingItem.size.cols
        && elt.size.rows === this.movingItem.size.rows
    });

    this.gridItems.splice(index, 1);
    this.emptyPositions(this.getPositionsListForItemSpot(item));
  }

  moveItem(item: GridItem, newPosition: GridPosition) {
    item.position = newPosition;
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
   * Unhover all grid
   */
  unHoverGrid() {
    this.unHoverPositions(this.getPositionsListForItemSpot({
      position: {row: 0, col: 0},
      size: {cols: this.config.cols, rows: this.config.rows}
    }));
  }

  /**
   * Empty all grid
   */
  emptyGrid() {
    this.emptyPositions(this.getPositionsListForItemSpot({
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

    // check if this is a moving item
    console.log(' movingItem ', this.movingItem);

    // if this is a moving item
    if (this.movingItem && this.movingItem.position) {
      // should free positions
      this.emptyPositions(this.getPositionsListForItemSpot(this.movingItem));
    }

    const isAvailable = this.getPositionsListForItemSpot(item).every((position: GridPosition) => {
      return this.isInGrid(position) && this.isPositionAvailable(position);
    });

    // reset occupation
    this.emptyGrid();
    this.gridItems.forEach(gridItem => {
      this.reserveItemSpot(gridItem);
    });

    return isAvailable;
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


  /**
   * do last line contain no element ?
   */
  isLastLineEmpy() {
    return !this.cellsOccupated[this.config.rows - 1].some(elt => elt === true);
  }
}

