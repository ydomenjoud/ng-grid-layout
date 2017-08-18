import {Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Grid} from '../../classes/grid';
import {GridPosition} from '../../classes/grid-position';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass']
})
export class GridComponent implements OnInit, OnChanges {

  @Input() rows = 3;
  @Input() cols = 3;
  @Input() rowHeight = 40;
  @ViewChild('gridView') gridView;

  containerHeight: number;
  grid: Grid;
  gridPositions: GridPosition[] = [];
  gridWidth: number;

  @HostListener('window:resize', ['$event.target'])
  onResize() {
    this.calculComponentWidth();
  }

  constructor(private elementRef: ElementRef) {
  }


  /**
   * add rows to the grid
   * @param {number} count
   */
  addRows(count = 1) {
    this.grid.addRows(count);

    this.rows += count;

    // set containerHeight
    this.containerHeight = this.rows * this.rowHeight;

    this.gridPositions = this.grid.getPositionsListForItemSpot({
      position: {row: 0, col: 0},
      size: {cols: this.cols, rows: this.rows}
    });
  }

  initGrid() {
    // build grid
    this.grid = new Grid({
      cols: this.cols,
      rows: this.rows,
      rowHeight: this.rowHeight
    });

    // set containerHeight
    this.containerHeight = this.rows * this.rowHeight;

    // get grid positions of all grid
    this.gridPositions = this.grid.getPositionsListForItemSpot({
      position: {row: 0, col: 0},
      size: {cols: this.cols, rows: this.rows}
    });
  }

  onDragHover(position: GridPosition, item, $event) {
    // console.log('over', position);
    this.grid.hoverItemSpot({position, size: this.grid.movingItem.size});
    return false;
    // this.grid.isItemSpotAvailable()
  }

  //
  // onDragEnter(position: GridPosition, item: GridDraggableDirective) {
  //   console.log('enter', position);
  //   // this.grid.isItemSpotAvailable()
  // }
  //
  // onDragLeave(position: GridPosition, item: GridDraggableDirective) {
  //   console.log('leave', position);
  //   // this.grid.isItemSpotAvailable()
  // }

  onDrop(position: GridPosition, item, $event) {
    // console.log('drop', position);
    this.grid.addItem({position, size: this.grid.movingItem.size});
    if (!this.grid.isLastLineEmpy()) {
      this.addRows(3);
    }
  }

  onClick(position: GridPosition, item, $event) {
    this.grid.removeItem({position, size: this.grid.movingItem.size});
  }

  calculComponentWidth() {
    this.gridWidth = this.gridView.nativeElement.getBoundingClientRect().width;
  }

  ngOnInit() {
    this.initGrid();
    this.calculComponentWidth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initGrid();
    // console.log(changes);
  }

}
