import { Component, OnInit } from '@angular/core';
import { HOMESTAY_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ListService } from 'src/EliCamps/services/list.service';
import { HomeStay } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-homestay-report',
  templateUrl: './homestay-report.component.html',
  styleUrls: ['./homestay-report.component.css']
})
export class HomestayReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs = HOMESTAY_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public homeStay: HomeStay[];
  public modules = AllModules;
  public startDate: string;
  public endDate: string;
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
  public dateChange = () => {
  }
  onGridReady(params) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event) {

    this.router.navigate(['addAgent'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
