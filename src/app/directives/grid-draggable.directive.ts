import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {GridComponent} from '../components/grid/grid.component';
import {Grid} from '../classes/grid';
import {GridItem} from '../classes/grid-item';

@Directive({
  selector: '[appGridDraggable]'
})
export class GridDraggableDirective {

  @Input() rows = 1;
  @Input() cols = 2;
  @Input() grid: Grid;
  @Input() appGridDraggable: GridComponent;
  @Input() item: GridItem;

  @HostListener('dragstart', ['$event'])
  onDragStart(event) {
    this.grid.movingItem = {cols: this.cols, rows: this.rows}
    // event.dataTransfer.effectAllowed = 'move';
    this.renderer.addClass(this.el.nativeElement, 'moving');
    console.log('start drag');
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event) {
    this.renderer.removeClass(this.el.nativeElement, 'moving');
    // if this is an item, we should remove it
    console.log(this.item);
    if (this.item) {
      this.grid.removeItem(this.item);
    }
    console.log('stop drag');
  }

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
    this.el.nativeElement.draggable = true
  }

}
