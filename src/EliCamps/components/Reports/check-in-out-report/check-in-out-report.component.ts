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
import * as moment from 'moment'
@Component({
  selector: 'app-check-in-out-report',
  templateUrl: './check-in-out-report.component.html',
  styleUrls: ['./check-in-out-report.component.css']
})
export class CheckInOutReportComponent implements OnInit {
  public columnDefs =
  [
    {
      headerName: 'Date',
      field: 'date'
    },
    {
      headerName: 'In',
      field: 'in'
    },
    {
      headerName: 'Out',
      field: 'out'
    },
    {
      headerName: 'Total',
      field: 'total'
    },
  ];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public studentList;
  public addinList: ProgrameAddins[] = [];
  public modules = AllCommunityModules;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public startDate = new Date('06/23/2020');
  public endDate = new Date('08/09/2020');;
  public campus: Campus;
  public campusList: Campus[];
  public rooms: Room[];
  public homestayList: HomeStay[];
  public programList = [];
  public program: Program;
  constructor(public listService: ListService) {
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
    this.getReportList();
  };
  public getReportList = () => {

    this.listService.getInsuranceReport().subscribe((res: Array<any>) => {
      this.studentList = res;
      this.createUIList(res);

    });
  };
  public createUIList(res) {
    const dates = this.enumerateDaysBetweenDates(this.startDate, this.endDate);
    let gridList = [];
    let total = 0;
   dates.forEach((date) => {
     let row = {
       date: date.toDateString(),
       in: res.filter(el => moment(el.programeStartDate).format('MM/DD/YYYY') ===  moment(date).format('MM/DD/YYYY')).length,
       out: res.filter(el => moment(el.programeEndDate).format('MM/DD/YYYY') ===  moment(date).format('MM/DD/YYYY')).length,
       total: total
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
    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    while(currDate.add(1, 'days').diff(lastDate) < 0) {
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
    if (this.startDate && this.endDate && !this.campus && !this.program ) {
      this.createUIList(this.studentList);
    } else if (this.startDate && this.endDate && this.campus && !this.program) {
      let list = this.studentList.filter((el) => {
        return (
          el.campusName === this.campus.campus
        );
      });
      this.createUIList(list);
    }
    else if (this.startDate && this.endDate && !this.campus && this.program) {
      let list = this.studentList.filter((el) => {
        return (
          el.programName === this.program.programName
        );
      });
      this.createUIList(list);
    }
    else if (this.campus && this.program && this.startDate && this.endDate) {
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
    const params = {
      columnGroups: true,
      allColumns: true,
      fileName: `Check-In${new Date().toLocaleString()}`,
    };
    this.gridApi.exportDataAsCsv(params);
  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.createUIList(this.studentList)
  }
}
