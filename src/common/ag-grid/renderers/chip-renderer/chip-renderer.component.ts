import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-chip-renderer',
  templateUrl: './chip-renderer.component.html',
  styleUrls: ['./chip-renderer.component.css']
})
export class ChipRendererComponent implements ICellRendererAngularComp {
  private params: any;

  public isActive = true;

  agInit(params: any): void {
    this.params = params;
    this.isActive = this.params.value;
  }

  // demonstrates how you can do "inline" editing of a cell
  onChange(checked: boolean) {

  }

  refresh(params: any): boolean {
    return false;
  }
}
