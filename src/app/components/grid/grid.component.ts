import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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

  constructor(private elementRef: ElementRef) {
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
    this.grid.hoverItemSpot({position, size: this.grid.movingItem});
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
    console.log('drop', position);
    this.grid.addItem({position, size: this.grid.movingItem});
  }

  onClick(position: GridPosition, item, $event) {
    this.grid.removeItem({position, size: this.grid.movingItem});
  }

  ngOnInit() {
    this.initGrid();
    this.gridWidth = this.gridView.nativeElement.getBoundingClientRect().width;
    console.log(this.gridWidth)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initGrid();
    // console.log(changes);
  }

}
