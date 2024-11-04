/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { PAYMENT_REPORT_COL_DEFS } from "apps/elicamps/src/common/elicamps-column-definitions";
import { LookupEnum } from "apps/elicamps/src/common/lookup.enums";
import { Campus, Program } from "apps/elicamps/src/models/Elicamps";
import { ListService } from "apps/elicamps/src/services/list.service";
import { Agent } from "http";

@Component({
  selector: "app-payment-report",
  templateUrl: "./payment-report.component.html",
  styleUrls: ["./payment-report.component.css"],
})
export class PaymentReportComponent implements OnInit {
  public defaultColDef;
  public selectedStatus = 'Active';

  public columnDefs: any = PAYMENT_REPORT_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public paymentReport: any;
  public yearList: any = [];
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public selectedYear = 2020;
  public rowModelType = "clientSide";
  public startDate: any;
  public endDate: any;
  public campus!: any;
  public campusList!: Campus[];
  public formatList!: any[];
  public agentList!: any[];
  public agent!: any;
  public format: any;
  public programList: any;
  public statusList: any = [];
  public program!: any;
  constructor(public listService: ListService) {
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
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
  }
  ngOnInit() {
    this.getDropdowns();
    this.getPaymentSummaryReport(this.selectedYear);
    this.getRowStyle = (params: any) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
      return {};
    };
  }
  public getDropdowns() {
    const params = {
      active: true,
    };
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res: any) => {
      this.statusList = res;
    });
    this.listService.getAllProgram(params).subscribe((res: any) => {
      this.programList = res.data;
    });
    this.listService.getAllCampus(params).subscribe((res: any) => {
      this.campusList = res.data;
    });
    this.listService.getAllAgent(params).subscribe((res: any) => {
      this.agentList = res.data;
    });
    this.listService.getAll(LookupEnum.FORMAT).subscribe((res: any) => {
      this.formatList = res;
    });
  }
  public getPaymentSummaryReport = (year: any) => {
    const params = {
      active: true,
    };
    this.listService.getPaymentReport(year).subscribe((res: any) => {
      this.paymentReport = (res as any).data;
      this.yearList = [];
      this.paymentReport = this.paymentReport.map((report: any) => {
        if (!this.yearList.includes(report.year)) {
          this.yearList.push(report.year);
        }
        report = this.calculate(report);
        return {
          ...report,
          status: this.getStatus(report),
          studentName: `${report.firstName} ${report.lastName}`,
          commision: report.commision
            ? (report.commision / 100) * report.totalGrossPrice
            : 0,
        };
      });
      this.paymentReport = this.paymentReport.sort((a: any, b: any) =>
        a.active > b.active ? -1 : 0
      );
      this.selectedYear = this.yearList[0];
      this.filterChage();
    });
  };
  public getStatus(row: any) {
    const statusRow = this.statusList.find((el: any) => el.id === row.statusId);
    if (row.departureDate && new Date(row.departureDate) <= new Date()) {
      return "Past";
    } else if (statusRow) {
      return statusRow['name'];
    } else {
      return "Active";
    }
  }
  public setPinnedRowData(list: any) {
    this.pinnedBottomRowData = [
      {
        totalGrossPrice: this.getSum("totalGrossPrice", list),
        netPrice: this.getSum("netPrice", list),
        paid: this.getSum("paid", list),
        balance: this.getSum("balance", list),
        commision: this.getSum("commision", list),
        registrationFee: this.getSum("registrationFee", list),
      },
    ];
  }
  public getSum = (key: string, list: Array<any>) => {
    return list.reduce((a, b) => a + (b[key] || 0), 0);
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, "PaymentSummaryReport");
  }
  public show() {
    this.getPaymentSummaryReport(this.selectedYear);
  }
  public applyDefaultValue(value: string) {
    if (!value) {
      setTimeout(() => {
        this.selectedYear = 2018;
      }, 1);
    }
  }
  public filterChage() {
    let list = this.paymentReport;
    if (this.campus) {
      list = this.paymentReport.filter((el: any) => {
        return el.campusName === this.campus.campus;
      });
    }
    if (this.program) {
      list = this.paymentReport.filter((el: any) => {
        return el.programName === this.program.programName;
      });
    }
    if (this.format) {
      list = this.paymentReport.filter((el: any) => {
        return el.formatName === this.format.name;
      });
    }
    if (this.agent) {
      list = this.paymentReport.filter((el: any) => {
        return el.agentName === this.agent.agent;
      });
    }
    if (this.selectedStatus) {
      list = list.filter(
        (row: any) => row.status === this.selectedStatus
      );
    }
    if (this.startDate && this.endDate) {
      list = list.filter(
        (el: any) =>
          new Date(el.arrivalDate) >= this.startDate &&
          new Date(el.arrivalDate) <= this.endDate
      );
    } else if (this.startDate) {
      list = list.filter((el: any) => new Date(el.arrivalDate) >= this.startDate);
    } else if (this.endDate) {
      list = list.filter((el: any) => new Date(el.arrivalDate) <= this.endDate);
    }
    this.setPinnedRowData(list);
    this.gridApi.setRowData(list);
  }
  public clear() {
    this.startDate = null;
    this.endDate = null;
    this.program = null;
    this.agent = null;
    this.format = null;
    this.campus = null;
    this.selectedStatus = 'Active';
    this.filterChage();
  }
  calculate = (row: any) => {
    let totalGross = row.totalGrossPrice;
    if (totalGross && !row.netPrice) {
      row.netPrice = totalGross;
      row.balance = totalGross;
    }
    if (row.totalAddins && !row.commision) {
      totalGross = totalGross + row.totalAddins;
      row.netPrice = totalGross;
    }
    const commisionToSubtract = (row.commision / 100) * totalGross;
    if (commisionToSubtract > -1) {
      let calculatedCommission = totalGross - commisionToSubtract;
      calculatedCommission = calculatedCommission + row.totalAddins;
      if (calculatedCommission) {
        row.netPrice = calculatedCommission;
      }
    }
    if (row.commissionAddins) {
      const setTotalNetValue = row.netPrice - row.commissionAddins;
      row.netPrice = setTotalNetValue;
    }
    if (row.netPrice) {
      const total = row.netPrice + row.registrationFee;
      const cummulativeValue = total - row.paid;
      row.balance = Math.round(cummulativeValue);
    } else {
      const balance = row.registrationFee - row.paid;
      row.balance = balance;
    }
    return row;
  };
}
