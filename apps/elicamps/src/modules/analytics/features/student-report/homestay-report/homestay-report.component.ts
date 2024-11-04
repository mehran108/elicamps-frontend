/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { HOMESTAY_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { HomeStay } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-homestay-report',
  templateUrl: './homestay-report.component.html',
  styleUrls: ['./homestay-report.component.css']
})
export class HomestayReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs: any = HOMESTAY_COL_DEFS;
  public gridOptions: any;
  public info: any;
  private gridApi: any;
  public homeStay: any;
  public startDate: any;
  public endDate: any;
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
    this.getAgentList();
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getAllHomeStay().subscribe(res => {
      this.homeStay = (res as any).data;
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event: any) {

    this.router.navigate(['addAgent'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
