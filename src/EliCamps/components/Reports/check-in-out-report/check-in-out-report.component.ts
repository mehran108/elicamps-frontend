import { Component, OnInit } from "@angular/core";
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
import * as moment from "moment";
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: "app-check-in-out-report",
  templateUrl: "./check-in-out-report.component.html",
  styleUrls: ["./check-in-out-report.component.css"],
})
export class CheckInOutReportComponent implements OnInit {
  public defaultColDef;

  public columnDefs = [
    {
      headerName: "Date",
      field: "date",
    },
    {
      headerName: "In",
      field: "in",
    },
    {
      headerName: "Out",
      field: "out",
    },
    {
      headerName: "Total",
      field: "total",
    },
  ];
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
  constructor(
    public listService: ListService,
    public groupService: GroupService
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
    const currentYear = new Date().getFullYear();
    this.startDate = new Date(`06/25/${currentYear}`);
    this.endDate = new Date(`08/14/${currentYear}`);
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
    this.getReportList();
  };
  public getReportList = () => {
    this.groupService
      .getAllElicampsStudents({ active: true })
      .subscribe((res: Array<any>) => {
        this.studentList = (res as any).data.filter(row => row.statusId !== 1030 && row.statusId !== 1036 && row.active);;
        this.createUIList(this.studentList);
      });
  };
  public createUIList(res) {
    const dates = this.enumerateDaysBetweenDates(this.startDate, this.endDate);
    let gridList = [];
    let total = 0;
    dates.forEach((date) => {
      let row = {
        date: date.toDateString(),
        in: res.filter(
          (el) =>
            new Date(el.arrivalDate).toLocaleDateString() ===
            date.toLocaleDateString()
        ).length,
        out: res.filter(
          (el) =>
            new Date(el.departureDate).toLocaleDateString() ===
            date.toLocaleDateString()
        ).length,
        total: total,
      };
      total += row.in;
      total -= row.out;
      row.total = total;
      gridList.push(row);
    });
    this.gridApi.setRowData(gridList);
  }
  enumerateDaysBetweenDates = (startDate, endDate) => {
    var dates = [];
    dates.push(startDate);
    var currDate = moment(startDate).startOf("day");
    var lastDate = moment(endDate).startOf("day");

    while (currDate.add(1, "days").diff(lastDate) < 0) {
      dates.push(currDate.clone().toDate());
    }
    dates.push(endDate);
    return dates;
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
    if (this.startDate && this.endDate && !this.campus && !this.program) {
      this.createUIList(this.studentList);
    } else if (this.startDate && this.endDate && this.campus && !this.program) {
      let list = this.studentList.filter((el) => {
        return el.campusName === this.campus.campus;
      });
      this.createUIList(list);
    } else if (this.startDate && this.endDate && !this.campus && this.program) {
      let list = this.studentList.filter((el) => {
        return el.programName === this.program.programName;
      });
      this.createUIList(list);
    } else if (this.campus && this.program && this.startDate && this.endDate) {
      let list = this.studentList.filter((el) => {
        return (
          el.campusName === this.campus.campus &&
          el.programName === this.program.programName
        );
      });
      this.createUIList(list);
    }
  };
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, "Check_In-Out");
  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.createUIList(this.studentList);
  }
}
