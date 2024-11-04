/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { MatSelectChange } from "@angular/material/select";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { AIRPORT_REPORT_COL_DEFS } from "apps/elicamps/src/common/elicamps-column-definitions";
import { LookupEnum } from "apps/elicamps/src/common/lookup.enums";
import { HomeStay, Room } from "apps/elicamps/src/models/Elicamps";
import { ListService } from "apps/elicamps/src/services/list.service";
import { throwError } from "rxjs";
import _ from 'lodash';
@Component({
  selector: "app-airport-transfer-report",
  templateUrl: "./airport-transfer-report.component.html",
  styleUrls: ["./airport-transfer-report.component.css"],
})
export class AirportTransferReportComponent implements OnInit {
  public columnDefs: any = AIRPORT_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: any;
  private gridApi: any;
  public paymentReport: any;;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public homestayList: any;
  public rooms: any;
  public startDate: any;
  public endDate: any;
  public reportType: any;
  public defaultColDef: any;
  public statusList: any = [];
  public selectedStatus = "Active";
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
  async ngOnInit() {
    const homestayList = await this.listService
      .getAllHomeStay()
      .toPromise()
      .catch((error) => throwError(error));
    if (homestayList) {
      this.homestayList = homestayList.data;
    }
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.statusList = res;
    });
    const roomList = await this.listService
      .getAllRoomList()
      .toPromise()
      .catch((error) => throwError(error));
    if (roomList) {
      this.rooms = roomList.data;
    }
    this.getAgentList();
    this.getRowStyle = (params: any) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
      return {};
    };
  }
  public getAgentList = () => {
    const params = {
      active: true,
    };
    this.listService.getInsuranceReport().subscribe((res) => {
      this.paymentReport = res.map((row: any) => ({
        ...row,
        status: this.getStatus(row),
      }));
      this.paymentReport = this.paymentReport.sort((a: any, b: any) =>
        a.active > b.active ? -1 : 0
      );
      this.filterData();
    });
  };
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
  filterStudents(changeEvent: MatSelectChange) {
    if (changeEvent.value) {
      this.paymentReport = this.paymentReport.filter(
        (row: any) => row.status === changeEvent.value
      );
      this.gridApi.setRowData(this.paymentReport);
    } else {
      this.gridApi.setRowData(this.paymentReport);
    }
  }
  public getAccAddress = (student: any) => {
    if (student) {
      switch (student.homestayOrResi) {
        case "1": {
          const home = this.homestayList.find(
            (stay: any) => stay.homeId === student.homestayID
          );
          return home ? home.address : "";
        }
        case "2": {
          const selectedRoom = this.rooms.find(
            (stay: any) => stay.id === student.roomID
          );
          return selectedRoom
            ? `${selectedRoom.roomID}, ${selectedRoom.building}`
            : "";
        }
      }
    }
  };
  public getCommision = () => {
    return this.paymentReport.reduce((a: any, b: any) => +a + +b.commision, 0);
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
    this.listService.exportGridData(this.gridApi, "AirportTransfer");
  }
  public filterData = () => {
    let list: any = this.paymentReport;
    if (this.selectedStatus) {
      list = list.filter((row: any) => row.status === this.selectedStatus);
    }
    switch (this.reportType) {
      case 1: {
        list = list.filter(
          (row: any) =>
            new Date(row.programeStartDate) >= this.startDate &&
            new Date(row.programeStartDate) <= this.endDate
        );
        list = _.orderBy(
          list,
          [(obj: any) => new Date(obj.programeStartDate)],
          ["asc"]
        );
        this.gridOptions.api.setRowData(list);
        break;
      }
      case 2: {
        list = list.filter(
          (row: any) =>
            new Date(row.programeEndDate) >= this.startDate &&
            new Date(row.programeEndDate) <= this.endDate
        );
        list = _.orderBy(
          list,
          [(obj: any) => new Date(obj.programeEndDate)],
          ["asc"]
        );
        this.gridOptions.api.setRowData(list);
        break;
      }
      default: {
        this.gridOptions.api.setRowData(list);
        break;
      }
    }
  };
  clear = () => {
    this.startDate = null;
    this.endDate = null;
    this.reportType = 0;
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.selectedStatus = 'Active';
    this.filterData();
  };
}
