import { Component, OnInit } from "@angular/core";
import {
  PAYMENT_REPORT_COL_DEFS,
  INSURANCE_REPORT_COL_DEFS,
} from "src/EliCamps/common/elicamps-column-definitions";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { ListService } from "src/EliCamps/services/list.service";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { LookupEnum } from "src/EliCamps/common/lookup.enums";
import { MatSelectChange } from "@angular/material";
import { SharedService } from "src/EliCamps/services/shared.service";
import { Program } from "typescript";
import * as moment from "moment";

@Component({
  selector: "app-insurance-report",
  templateUrl: "./insurance-report.component.html",
  styleUrls: ["./insurance-report.component.css"],
})
export class InsuranceReportComponent implements OnInit {
  public defaultColDef;

  public columnDefs = INSURANCE_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public paymentReport = [];
  public filteredReport = [];
  public statusList = [];
  public modules = AllModules;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public selectedStatus = "Active";
  public programList = [];
  public campusList = [];
  public agentList = [];
  public formatList = [];
  public program: any;
  public agent: any;
  public campus: any;
  public format: any;
  public endDate: any;
  public startDate: any;
  constructor(public listService: ListService, public shared: SharedService) {
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
    this.getRowStyle = (params) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
    this.getDropdowns();
  }
  public getDropdowns() {
    const params = {
      active: true,
    };
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.statusList = res;
    });
    this.listService.getAllProgram(params).subscribe((res) => {
      this.programList = res.data;
    });
    this.listService.getAllCampus(params).subscribe((res) => {
      this.campusList = res.data;
    });
    this.listService.getAllAgent(params).subscribe((res) => {
      this.agentList = res.data;
    });
    this.listService.getAll(LookupEnum.FORMAT).subscribe((res) => {
      this.formatList = res;
    });
  }
  public getAgentList = () => {
    const params = {
      active: true,
    };
    this.listService.getInsuranceReport().subscribe((res) => {
      this.paymentReport = res.map((row) => ({
        ...row,
        status: this.getStatus(row),
      }));
      this.paymentReport = this.paymentReport.sort((a, b) =>
        a.active > b.active ? -1 : 0
      );
      this.filterStudents();
    });
  };
  public getStatus(row) {
    const statusRow = this.statusList.find((el) => el.id === row.statusId);
    if (
      row.statusId !== 1030 &&
      row.programeEndDate &&
      new Date(row.programeEndDate) <= new Date()
    ) {
      return "Past";
    } else if (statusRow) {
      return statusRow.name;
    } else {
      return "Active";
    }
  }
  filterStudents() {
    let list = this.paymentReport;
    if (this.selectedStatus) {
      list = list.filter((row) => row.status === this.selectedStatus);
    }
    this.gridApi.setRowData(list);
  }
  public getCommision = () => {
    return this.paymentReport.reduce((a, b) => +a + +b.commision, 0);
  };
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.shared.exportInsuranceEnrollment(this.filteredReport.length > 0 ? this.filteredReport : this.paymentReport);
  }
  public clear() {
    this.startDate = null;
    this.endDate = null;
    this.program = null;
    this.agent = null;
    this.format = null;
    this.campus = null;
    this.selectedStatus = "Active";
    this.filterChage();
  }
  public filterChage() {
    let list = [...this.paymentReport];
    if (this.campus) {
      list = list.filter((el) => {
        return el.campusName === this.campus.campus;
      });
    }
    if (this.program) {
      list = list.filter((el) => {
        return el.programName === this.program.programName;
      });
    }
    if (this.format) {
      list = list.filter((el) => {
        return el.formatName === this.format.name;
      });
    }
    if (this.agent) {
      list = list.filter((el) => {
        return el.agentName === this.agent.agent;
      });
    }
    if (this.selectedStatus) {
      list = list.filter((row) => row.status === this.selectedStatus);
    }
    if (this.startDate && this.endDate) {
      list = list.filter(
        (el) =>
          new Date(el.arrivalDate) >= this.startDate &&
          new Date(el.arrivalDate) <= this.endDate
      );
    } else if (this.startDate) {
      list = list.filter((el) => new Date(el.arrivalDate) >= this.startDate);
    } else if (this.endDate) {
      list = list.filter((el) => new Date(el.arrivalDate) <= this.endDate);
    }
    // this.setPinnedRowData(list);
    this.filteredReport = [...list];
    this.gridApi.setRowData(list);
  }
}
