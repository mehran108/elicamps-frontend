import { Component, OnInit } from '@angular/core';
import { PAYMENT_REPORT_COL_DEFS, INSURANCE_REPORT_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ListService } from 'src/EliCamps/services/list.service';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-insurance-report',
  templateUrl: './insurance-report.component.html',
  styleUrls: ['./insurance-report.component.css']
})
export class InsuranceReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs = INSURANCE_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public paymentReport = [];
  public modules = AllModules;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  constructor(public listService: ListService
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
    this.getRowStyle = (params) => {
      if (params.node.rowPinned) {
        return { 'font-weight': 'bold' };
      }
    };
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getInsuranceReport().subscribe(res => {
      this.paymentReport = res;
    });
  }
  public getCommision = () => {
    return this.paymentReport.reduce((a, b) => +a + +b.commision, 0);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'InsuranceReport')

  }
}

