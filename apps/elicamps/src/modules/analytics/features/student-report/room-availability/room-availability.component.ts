/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { throwError } from "rxjs";
import moment from 'moment';
import { GridApi } from "ag-grid-community";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { ProgrameAddins, Campus, Room, HomeStay, Program } from "apps/elicamps/src/models/Elicamps";
import { GroupService } from "apps/elicamps/src/services/group.service";
import { ListService } from "apps/elicamps/src/services/list.service";

@Component({
  selector: "app-room-availability",
  templateUrl: "./room-availability.component.html",
  styleUrls: ["./room-availability.component.css"],
})
export class RoomAvailabilityComponent implements OnInit {
 public defaultColDef;

  public columnDefs: any = [];
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
  public info!: string;
  private gridApi!: GridApi;
  public studentList: any;
  public addinList: ProgrameAddins[] = [];
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public startDate: any;
  public endDate: any;
  public campus!: any;
  public campusList!: Campus[];
  public rooms!: Room[];
  public homestayList!: HomeStay[];
  public programList: any;;
  public program!: any;
  constructor(public listService: ListService, public studentService: GroupService) {
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
    this.getRowStyle = (params: any) => {
      if (params.node.rowPinned) {
        return { "font-weight": "bold" };
      }
      return {};
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
      this.rooms = this.rooms.filter((row: any) => row.active);
      this.gridApi.setGridOption('rowData', []);
    }
    this.studentService.getAllElicampsStudents({}).subscribe((res: any) => {
      this.studentList = res.data.filter((row: any) => row.statusId !== 1030 && row.statusId !== 1036 && row.active);;
    })
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
    if (this.campus && this.startDate && this.endDate) {
      this.createColumns();
      this.ceatUIList();
    }
  };
  public createColumns() {
    const dates = this.enumerateDaysBetweenDates(this.startDate, this.endDate);
    const columns: any = [];
    dates.forEach((date: Date) => {
      const column: any = {
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
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
    this.rooms.forEach((row: any) => {
      dates.forEach(date => {
        const findColumn = date >= new Date(row.availableFrom) && date <= new Date(row.availableTo);
        row[date.toLocaleDateString()] = findColumn ? '' : 'UA';
        if (findColumn) {
          const student = this.studentList.find((el: any) => el.roomID === row.id);
          if(student && date >= new Date(student.roomSearchFrom) && date <= new Date(student.roomSearchTo)) {
            row[date.toLocaleDateString()] = 'X'
          }
        }
      });
    });
  }
  public ceatUIList() {
    const list = this.rooms.filter((el) => {
      return (
        el.campusID === this.campus.id
        );
    });
    if (list.length > 0) {
      this.gridApi.setGridOption('rowData', list);
    }
  }
  enumerateDaysBetweenDates = (startDate: any, endDate: any) => {
    const dates = [];
    dates.push(startDate);
    const currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');

    while(currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
    }
    dates.push(endDate);
    return dates;
};
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Room_Availability')
  }
  public clear() {
    this.program = null;
    this.campus = null;
    this.startDate = null;
    this.endDate = null;
    this.gridApi.setGridOption('rowData', this.studentList);
  }
}
