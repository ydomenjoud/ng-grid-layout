import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';
import {FormsModule} from '@angular/forms';
import { GridDraggableDirective } from './directives/grid-draggable.directive';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    GridDraggableDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
