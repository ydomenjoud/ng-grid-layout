import {Component, ViewChild} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  cols = 3;
  rows = 3;
  rowHeight = 40;

  @ViewChild('grid') grid;

  addRow() {

    const backup = _.cloneDeep(this.grid.grid.gridItems)
    console.log(backup);
    this.rows++;
    this.grid.grid.gridItems = backup;
  }
}
