/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { HOMESTAY_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { HomeStay } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-home-stays',
  templateUrl: './home-stays.component.html',
  styleUrls: ['./home-stays.component.css'],
})
export class HomeStaysComponent {
  public defaultColDef;

  public columnDefs: any = HOMESTAY_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public homeStayList!: HomeStay[];
  public gridColumnApi: any;
  constructor(public router: Router, public listService: ListService) {
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
  public getHomeStayList = () => {
    this.listService.getAllHomeStay().subscribe((res) => {
      this.homeStayList = (res as any).data;
      this.autoSizeAll(false);
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getHomeStayList();
  }
  autoSizeAll(skipHeader: any) {
    const allColumnIds: any = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Homestay');
  }
  onCellClicked($event: any) {
    this.router.navigate(['addHomeStay'], {
      queryParams: {
        id: btoa($event.data.homeId),
      },
    });
  }
}
