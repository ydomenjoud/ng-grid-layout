import {Component, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {GridComponent} from './components/grid/grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  cols = 3;
  rows = 3;
  rowHeight = 40;

  @ViewChild('grid') grid: GridComponent;

  addRow() {
    this.grid.addRows();
  }
}
