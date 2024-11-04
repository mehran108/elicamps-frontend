/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { CAMPUS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Campus } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {
 public defaultColDef;


  public columnDefs: any = CAMPUS_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public campusList!: Campus[];
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
  ngOnInit() {
    this.getCampusList();
  }
  public getCampusList = () => {
    const params = {
      active: true
    };
    this.listService.getAllCampus({}).subscribe(res => {
      this.campusList = (res as any).data;
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
    this.listService.exportGridData(this.gridApi, 'Campus')
  }
  onCellClicked($event: any) {

    this.router.navigate(['addCampus'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
