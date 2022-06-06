import { Component, OnInit } from "@angular/core";
import {
  STUDENT_COL_DEFS,
  AIRPORT_REPORT_COL_DEFS,
  SITE_BY_DATE_REPORT_COL_DEFS,
} from "src/EliCamps/common/elicamps-column-definitions";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { Router } from "@angular/router";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import {
  Student,
  Campus,
  Room,
  ProgrameAddins,
  HomeStay,
  Program,
} from "src/EliCamps/EliCamps-Models/Elicamps";
import { GroupService } from "src/EliCamps/services/group.service";
import { ListService } from "src/EliCamps/services/list.service";
import { throwError } from "rxjs";
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: "app-student-report",
  templateUrl: "./student-report.component.html",
  styleUrls: ["./student-report.component.css"],
})
export class StudentReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs = SITE_BY_DATE_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public studentList;
  public addinList: ProgrameAddins[] = [];
  public modules = AllModules;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public startDate;
  public endDate;
  public campus: Campus;
  public campusList: Campus[];
  public rooms: Room[];
  public homestayList: HomeStay[];
  public programList = [];
  public program: Program;
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
    this.getRowStyle = (params) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
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
    const campuseResponse = await this.listService
      .getAllCampus(params)
      .toPromise()
      .catch((error) => throwError(error));
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
      this.studentList = res.map((row) => ({
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
      }));
    });
  };
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
  public getMedicalInfo = (row) => {
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
    const list = [];
    if (addins && addins.length > 0) {
      addins.forEach((element) => {
        const addin = this.addinList.find((row) => row.id === element);
        if (addin) {
          list.push(addin.addins);
        }
      });
    }
    return list.toString();
  };
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  filterChage = () => {
    if (this.campus && this.program && this.startDate && this.endDate) {
      let list = this.studentList.filter((el) => {
        return (
          el.campusName === this.campus.campus &&
          el.programName === this.program.programName
        );
      });
      list = list.filter(
        (el) =>
          new Date(el.programeStartDate) >= this.startDate &&
          new Date(el.programeEndDate) <= this.endDate
      );
      this.gridApi.setRowData(list);
    }
  };
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'SiteReport')

  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.startDate = null;
    this.endDate = null;
    this.gridApi.setRowData(this.studentList);
  }
}
