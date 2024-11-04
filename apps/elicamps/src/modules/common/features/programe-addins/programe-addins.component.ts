/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ADDINS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { ProgrameAddins } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-programe-addins',
  templateUrl: './programe-addins.component.html',
  styleUrls: ['./programe-addins.component.css']
})
export class ProgrameAddinsComponent implements OnInit {

  public columnDefs: any = ADDINS_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public addinList!: ProgrameAddins[];
  public gridColumnApi: any;
   public defaultColDef;
  constructor(public router: Router, public listService: ListService, public location: Location
  ) {
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
  ngOnInit() {
    this.getAgentList();
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinList = (res as any).data;
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'ProgramAddins')

  }
  onCellClicked($event: any) {

    this.router.navigate(['/addAddins'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
