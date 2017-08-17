import {GridConfig} from '../classes/grid-config';
import {GridItem} from '../classes/grid-item';
import {GridPosition} from '../classes/grid-position';
import {Grid} from './grid';
import {CellType} from '../enums/cell-type.enum';

describe('GridService', () => {

  let grid: Grid;

  beforeEach(() => {
    grid = new Grid();
    grid.initConfig(new GridConfig());
  });

  it('should be created', () => {
    expect(grid).toBeTruthy();
  });


  it('should have required configuration set', () => {
    const config = {cols: 2, rows: 2};
    const defaultConfig = new GridConfig();

    grid.initConfig(config);

    expect(grid.config.cols).toEqual(config.cols);
    expect(grid.config.rows).toEqual(config.rows);
    expect(grid.config.rowHeight).toEqual(defaultConfig.rowHeight);
  });

  it('should build grid cells completion', () => {
    grid.initConfig({cols: 3, rows: 3});

    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Empty, CellType.Empty],
      ]
    );
  });

  it('should calculate grid range', () => {
    grid.initConfig({cols: 3, rows: 2});
    expect(grid.isInGrid({row: 0, col: 0})).toBeTruthy('coordinate [0,0] should be in grid');
    expect(grid.isInGrid({row: 1, col: 1})).toBeTruthy('coordinate [1,1] should be in grid');
    expect(grid.isInGrid({row: 2, col: 2})).toBeFalsy('coordinate [2,2] should be out of grid');
    expect(grid.isInGrid({row: 1, col: 3})).toBeFalsy('coordinate [1,2] should be out of grid');
    expect(grid.isInGrid({row: 3, col: 1})).toBeFalsy('coordinate [2,1] should be out of grid');
    expect(grid.isInGrid({row: 3, col: 3})).toBeFalsy('coordinate [3,3] should be out of grid');
  });

  it('should register and store grid item', () => {
    const item = new GridItem();
    item.position = {row: 2, col: 2};

    expect(grid.items.length).toEqual(0);

    grid.addItem(item);

    expect(grid.items.length).toEqual(1);
  });

  it('should calculate item cells', () => {
    let item: GridItem = {
      position: {row: 0, col: 0},
      size: {rows: 1, cols: 1}
    };
    expect(grid.getPositionsListForItemSpot(item).length).toEqual(1);

    item = {
      position: {row: 0, col: 0},
      size: {rows: 2, cols: 2}
    };
    expect(grid.getPositionsListForItemSpot(item).length).toEqual(4);

    item = {
      position: {row: 1, col: 1},
      size: {rows: 1, cols: 2}
    };
    expect(grid.getPositionsListForItemSpot(item).length).toEqual(2);
  });

  it('should reserve position', () => {
    const position: GridPosition = {row: 1, col: 1};
    expect(grid.isPositionAvailable(position)).toBeTruthy();
    grid.reservePositions([position]);
    expect(grid.isPositionAvailable(position)).toBeFalsy('should be occupated');
    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Occupated, CellType.Empty],
        [CellType.Empty, CellType.Empty, CellType.Empty]
      ]
    );
  });


  it('should reserve simple spot', () => {
    const item: GridItem = {
      position: {row: 1, col: 1},
      size: {rows: 1, cols: 1}
    };

    expect(grid.isItemSpotAvailable(item)).toBeTruthy('should be free');
    grid.reserveItemSpot(item);
    expect(grid.isItemSpotAvailable(item)).toBeFalsy('should be occupated');
    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Occupated, CellType.Empty],
        [CellType.Empty, CellType.Empty, CellType.Empty]
      ]
    );

  });

  it('should reserve complexe spot', () => {
    const item: GridItem = {
      position: {row: 0, col: 1},
      size: {rows: 2, cols: 1}
    };

    expect(grid.isItemSpotAvailable(item)).toBeTruthy('should be free');
    grid.reserveItemSpot(item);
    expect(grid.isItemSpotAvailable(item)).toBeFalsy('should be occupated');
    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Occupated, CellType.Empty],
        [CellType.Empty, CellType.Occupated, CellType.Empty],
        [CellType.Empty, CellType.Empty, CellType.Empty]
      ]
    );
  });

  it('should reserve complexe spot 2', () => {
    const item: GridItem = {
      position: {row: 0, col: 1},
      size: {rows: 2, cols: 2}
    };

    expect(grid.isItemSpotAvailable(item)).toBeTruthy('should be free');
    grid.reserveItemSpot(item);
    expect(grid.isItemSpotAvailable(item)).toBeFalsy('should be occupated');
    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Occupated, CellType.Occupated],
        [CellType.Empty, CellType.Occupated, CellType.Occupated],
        [CellType.Empty, CellType.Empty, CellType.Empty]
      ]
    );
  });

  it('should add item and reserve slot', () => {
    grid.initConfig({cols: 3, rows: 3});

    const item = new GridItem();
    item.position = {row: 1, col: 1};
    item.size = {rows: 2, cols: 2};
    grid.addItem(item);

    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Occupated, CellType.Occupated],
        [CellType.Empty, CellType.Occupated, CellType.Occupated]
      ]
    );

  });

  it('should prevent item overlap', () => {
    grid.initConfig({cols: 3, rows: 3});

    let item: GridItem = {
      position: {row: 1, col: 1},
      size: {rows: 2, cols: 2}
    };

    grid.addItem(item);

    expect(grid.cells).toEqual(
      [
        [CellType.Empty, CellType.Empty, CellType.Empty],
        [CellType.Empty, CellType.Occupated, CellType.Occupated],
        [CellType.Empty, CellType.Occupated, CellType.Occupated]
      ]
    );

    item = {
      position: {row: 0, col: 0},
      size: {rows: 2, cols: 1}
    };

    grid.addItem(item);

    expect(grid.cells).toEqual(
      [
        [CellType.Occupated, CellType.Empty, CellType.Empty],
        [CellType.Occupated, CellType.Occupated, CellType.Occupated],
        [CellType.Empty, CellType.Occupated, CellType.Occupated]
      ]
    );

    item = {
      position: {row: 0, col: 1},
      size: {rows: 2, cols: 1}
    };
    try {
      grid.addItem(item);
      fail('should raise an error');
    } catch (error) {
    }

  });

});
