import { Component, OnInit } from "@angular/core";
import { SITE_BY_DATE_REPORT_COL_DEFS} from "src/EliCamps/common/elicamps-column-definitions";
import { AllCommunityModules, GridApi } from "@ag-grid-community/all-modules";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import {
  Student,
  Campus,
  Room,
  ProgrameAddins,
  HomeStay,
  Program,
} from "src/EliCamps/EliCamps-Models/Elicamps";
import { ListService } from "src/EliCamps/services/list.service";
import { throwError } from "rxjs";
import * as moment from 'moment'
import { GroupService } from "src/EliCamps/services/group.service";
@Component({
  selector: "app-room-availability",
  templateUrl: "./room-availability.component.html",
  styleUrls: ["./room-availability.component.css"],
})
export class RoomAvailabilityComponent implements OnInit {
  public columnDefs = [];
  public defaultColumns = [
  {
    headerName: 'Room Space',
    field: 'roomID'
  },
  {
    headerName: 'Room Type',
    field: 'roomType'
  },
  {
    headerName: 'Building',
    field: 'building'
  },

  ]
  public gridOptions: any;
  public info: string;
  private gridApi: GridApi;
  public studentList;
  public addinList: ProgrameAddins[] = [];
  public modules = AllCommunityModules;
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
  constructor(public listService: ListService, public studentService: GroupService) {
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
    this.getRowStyle = (params) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
    };
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
      this.rooms = this.rooms.filter(row => row.active);
      this.gridApi.setRowData([]);
    }
    this.studentService.getAllElicampsStudents({}).subscribe((res: any) => {
      this.studentList = res.data;
    })
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
    if (this.campus && this.startDate && this.endDate) {
      this.createColumns();
      this.ceatUIList();
    }
  };
  public createColumns() {
    const dates = this.enumerateDaysBetweenDates(this.startDate, this.endDate);
    const columns = [];
    dates.forEach((date: Date) => {
      let column = {
        headerName: moment(date).format('DD-MMM'),
        field: date.toLocaleDateString(),
        cellStyle: (params: any) => {
          return {
            'background-color': `${params.value == 'X' ? 'green' : ''}`,
          };
        },

      };
      columns.push(column);
    });
    this.columnDefs = [...this.defaultColumns, ...columns];
    this.gridApi.setColumnDefs(this.columnDefs);
    this.rooms.forEach(row => {
      dates.forEach(date => {
        const findColumn = date >= new Date(row.availableFrom) && date <= new Date(row.availableTo);
        row[date.toLocaleDateString()] = findColumn ? '' : 'UA';
        if (findColumn) {
          const student = this.studentList.find(el => el.roomID === row.id);
          if(student && date >= new Date(student.roomSearchFrom) && date <= new Date(student.roomSearchTo)) {
            row[date.toLocaleDateString()] = 'X'
          }
        }
      });
    });
  }
  public ceatUIList() {
    let list = this.rooms.filter((el) => {
      return (
        el.campusID === this.campus.id
        );
    });
    if (list.length > 0) {
      this.gridApi.setRowData(list);
    }
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
  onBtnExport(): void {
    const params = {
      columnGroups: true,
      allColumns: true,
      fileName: `SiteReport${new Date().toLocaleString()}`,
    };
    this.gridApi.exportDataAsCsv(params);
  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.startDate = null;
    this.endDate = null;
    this.gridApi.setRowData(this.studentList);
  }
}
