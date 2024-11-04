/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ROOMS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Room } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  public columnDefs: any = ROOMS_COL_DEFS;
  public rowData!: any[];
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public roomList: Room[] = [];
  public isEdit = false;
  public id!: number;
  public gridColumnApi: any;
  public defaultColDef;
  constructor(
    private listService: ListService,
    public router: Router) {
        this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
  }
  public getRoomList = () => {
    this.listService.getAllRoomList().subscribe((res: any) => {
      this.roomList = (res.data || []);
      this.autoSizeAll(false);
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  autoSizeAll(skipHeader: any) {
    const allColumnIds: any = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getRoomList();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Rooms_Report')
  }
  onCellClicked($event: any) {

    this.router.navigate(['addRoom'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }

}
