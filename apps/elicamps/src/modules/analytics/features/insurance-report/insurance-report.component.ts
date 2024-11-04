/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { INSURANCE_REPORT_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { LookupEnum } from 'apps/elicamps/src/common/lookup.enums';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-insurance-report',
  templateUrl: './insurance-report.component.html',
  styleUrls: ['./insurance-report.component.css']
})
export class InsuranceReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs: any = INSURANCE_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: any;
  private gridApi: any;
  public paymentReport: any;;
  public statusList: any = [];
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public selectedStatus = 'Active';
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
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.statusList = res;
    });
    this.getAgentList();
    this.getRowStyle = (params: any) => {
      if (params.node.rowPinned) {
        return { 'font-weight': 'bold' };
      }
      return {};
    };
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getInsuranceReport().subscribe(res => {
      this.paymentReport = res.map((row: any) => ({
        ...row,
        status: this.getStatus(row),
      }));
      this.paymentReport = this.paymentReport.sort((a: any, b: any) =>
      a.active > b.active ? -1 : 0
    );
    this.filterStudents();
    });
  }
  public getStatus(row: any) {
    const statusRow = this.statusList.find((el: any) => el.id === row.statusId);
    if (row.statusId !== 1030 && row.programeEndDate && new Date(row.programeEndDate) <= new Date()) {
      return "Past";
    } else if (statusRow) {
      return statusRow['name'];
    } else {
      return "Active";
    }
  }
  filterStudents() {
    let list = this.paymentReport;
    if (this.selectedStatus) {
      list = list.filter((row: any) => row['status'] === this.selectedStatus);
    }
    this.gridApi.setRowData(list);
  }
  public getCommision = () => {
    return this.paymentReport.reduce((a: any, b: any) => +a + +b['commision'], 0);
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
    this.listService.exportGridData(this.gridApi, 'InsuranceReport')

  }
}

