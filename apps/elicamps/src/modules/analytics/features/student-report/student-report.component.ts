/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { MatSelectChange } from "@angular/material/select";
import { SITE_BY_DATE_REPORT_COL_DEFS } from "apps/elicamps/src/common/elicamps-column-definitions";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { LookupEnum } from "apps/elicamps/src/common/lookup.enums";
import { ProgrameAddins, Campus, Room, HomeStay, Program } from "apps/elicamps/src/models/Elicamps";
import { ListService } from "apps/elicamps/src/services/list.service";

@Component({
  selector: "app-student-report",
  templateUrl: "./student-report.component.html",
  styleUrls: ["./student-report.component.css"],
})
export class StudentReportComponent implements OnInit {
  public defaultColDef;

  public columnDefs: any = SITE_BY_DATE_REPORT_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public studentList: any;
  public addinList: ProgrameAddins[] = [];
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public startDate: any;
  public endDate: any;
  public campus: any;
  public campusList!: any[];
  public rooms!: any[];
  public homestayList!: any[];
  public programList: any;
  public statusList: any = [];
  public program: any;
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
  }
  ngOnInit() {
    this.getCampusList();
    this.getPrograms();
    this.getRowStyle = (params: any) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
      return {};
    };
  }
  public getPrograms() {
    const params = {
      active: true,
    };
    this.listService.getAllProgram(params).subscribe((res) => {
      this.programList = res.data;
    });
  }
  public getCampusList = async () => {
    const params = {
      active: true,
    };
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res: any) => {
      this.statusList = res;
    });
    const campuseResponse = await this.listService
      .getAllCampus(params)
      .toPromise()
      .catch((error: any) => throwError(error));
    if (campuseResponse) {
      this.campusList = campuseResponse.data;
    }
    const roomList = await this.listService
      .getAllRoomList()
      .toPromise()
      .catch((error) => throwError(error));
    if (roomList) {
      this.rooms = roomList.data;
    }
    const addinList = await this.listService
      .getAllAddins(params)
      .toPromise()
      .catch((error) => throwError(error));
    if (addinList) {
      this.addinList = addinList.data;
    }
    const homestayList = await this.listService
      .getAllHomeStay()
      .toPromise()
      .catch((error) => throwError(error));
    if (homestayList) {
      this.homestayList = homestayList.data;
    }
    this.getAgentList();
  };
  public getAgentList = () => {
    const params = {
      active: true,
    };
    this.listService.getInsuranceReport().subscribe((res) => {
      this.studentList = res.map((row: any) => ({
        ...row,
        name: `${row.firstName} ${row.lastName}`,
        medicalInformation: this.getMedicalInfo(row),
        homestayName: this.getHomeStay(row.homestayID)
          ? this.getHomeStay(row.homestayID).name
          : "",
        programeAddins: this.getAddins(row.programeAddins),
        hostContactInfo: this.getHomeStay(row.homestayID)
          ? this.getHomeStay(row.homestayID).cellNumber
          : "",
        room: this.rooms.find((room) => room.id === row.roomID) || {},
        status: this.getStatus(row),
      }));
      this.studentList = this.studentList.sort((a: any, b: any) =>
        a.active > b.active ? -1 : 0
      );
      this.filterChage();
    });
  };
  public getStatus(row: any) {
    const statusRow = this.statusList.find((el: any) => el['id'] === row.statusId);
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
      this.studentList = this.studentList.filter(
        (row: any) => row.status === changeEvent.value
      );
      this.gridApi.setRowData(this.studentList);
    } else {
      this.gridApi.setRowData(this.studentList);
    }
  }
  public getHomeStay = (homestayID: number) => {
    if (homestayID) {
      const homestay = this.homestayList.find(
        (home) => home.homeId === homestayID
      );
      if (homestay) {
        return homestay;
      }
    }
  };
  public getMedicalInfo = (row: any) => {
    const list = [];
    if (row.dietaryNeeds) {
      list.push(row.dietaryNeeds);
    }
    if (row.allergies) {
      list.push(row.allergies);
    }
    if (row.medicalNotes) {
      list.push(row.medicalNotes);
    }
    return list.toString();
  };
  public getAddins = (addins: any) => {
    const list: any = [];
    if (addins && addins.length > 0) {
      addins.forEach((element: any) => {
        const addin = this.addinList.find((row) => row.id === element);
        if (addin) {
          list.push(addin.addins);
        }
      });
    }
    return list.toString();
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  filterChage = () => {
    let list = this.studentList;
    if (this.campus) {
      list = list.filter((el: any) => {
        return el.campusName === this.campus.campus;
      });
    }
    if (this.program) {
      list = list.filter((el: any) => {
        return el.programName === this.program.programName;
      });
    }
    if (this.startDate) {
      list = list.filter((el: any) => new Date(el.arrivalDate) >= this.startDate);
    }
    if (this.endDate) {
      list = list.filter((el: any) => new Date(el.arrivalDate) <= this.endDate);
    }
    if (this.selectedStatus) {
      list = list.filter((row: any) => row.status === this.selectedStatus);
    }
    if (this.startDate && this.endDate) {
      list = list.filter(
        (el: any) =>
          new Date(el.arrivalDate) >= this.startDate &&
          new Date(el.arrivalDate) <= this.endDate
      );
    }
    this.gridApi.setRowData(list);
  };
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, "SiteReport");
  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.startDate = null;
    this.endDate = null;
    this.selectedStatus = 'Active';
    this.filterChage();
  }
}
