import { Component, OnInit } from "@angular/core";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { ListService } from "src/EliCamps/services/list.service";
import { AIRPORT_REPORT_COL_DEFS } from "src/EliCamps/common/elicamps-column-definitions";
import { throwError } from "rxjs";
import { HomeStay, Room } from "src/EliCamps/EliCamps-Models/Elicamps";
import * as _ from "lodash";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { LookupEnum } from "src/EliCamps/common/lookup.enums";
import { MatSelectChange } from "@angular/material";

@Component({
  selector: "app-airport-transfer-report",
  templateUrl: "./airport-transfer-report.component.html",
  styleUrls: ["./airport-transfer-report.component.css"],
})
export class AirportTransferReportComponent implements OnInit {
  public columnDefs = AIRPORT_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public paymentReport = [];
  public modules = AllModules;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public homestayList: HomeStay[];
  public rooms: Room[];
  public startDate;
  public endDate;
  public reportType;
  public defaultColDef;
  public statusList = [];
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
    this.getRowStyle = (params) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
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
      this.filterData();
    });
  };
  public getStatus(row) {
    const statusRow = this.statusList.find((el) => el.id === row.statusId);
    if (row.statusId !== 1030 && row.programeEndDate && new Date(row.programeEndDate) <= new Date()) {
      return "Past";
    } else if (statusRow) {
      return statusRow.name;
    } else {
      return "Active";
    }
  }
  filterStudents(changeEvent: MatSelectChange) {
    if (changeEvent.value) {
      this.paymentReport = this.paymentReport.filter(
        (row) => row.status === changeEvent.value
      );
      this.gridApi.setRowData(this.paymentReport);
    } else {
      this.gridApi.setRowData(this.paymentReport);
    }
  }
  public getAccAddress = (student) => {
    if (student) {
      switch (student.homestayOrResi) {
        case "1": {
          const home = this.homestayList.find(
            (stay) => stay.homeId === student.homestayID
          );
          return home ? home.address : "";
        }
        case "2": {
          const selectedRoom = this.rooms.find(
            (stay) => stay.id === student.roomID
          );
          return selectedRoom
            ? `${selectedRoom.roomID}, ${selectedRoom.building}`
            : "";
        }
      }
    }
  };
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
    this.listService.exportGridData(this.gridApi, "AirportTransfer");
  }
  public filterData = () => {
    let list = this.paymentReport;
    if (this.selectedStatus) {
      list = list.filter((row) => row.status === this.selectedStatus);
    }
    switch (this.reportType) {
      case 1: {
        list = list.filter(
          (row) =>
            new Date(row.programeStartDate) >= this.startDate &&
            new Date(row.programeStartDate) <= this.endDate
        );
        list = _.orderBy(
          list,
          [(obj) => new Date(obj.programeStartDate)],
          ["asc"]
        );
        this.gridOptions.api.setRowData(list);
        break;
      }
      case 2: {
        list = list.filter(
          (row) =>
            new Date(row.programeEndDate) >= this.startDate &&
            new Date(row.programeEndDate) <= this.endDate
        );
        list = _.orderBy(
          list,
          [(obj) => new Date(obj.programeEndDate)],
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
