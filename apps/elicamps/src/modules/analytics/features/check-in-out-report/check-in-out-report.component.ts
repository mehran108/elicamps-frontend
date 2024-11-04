/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { throwError } from "rxjs";
import moment from "moment";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { GroupService } from "apps/elicamps/src/services/group.service";
import { ListService } from "apps/elicamps/src/services/list.service";

@Component({
  selector: "app-check-in-out-report",
  templateUrl: "./check-in-out-report.component.html",
  styleUrls: ["./check-in-out-report.component.css"],
})
export class CheckInOutReportComponent implements OnInit {
  public defaultColDef;

  public columnDefs: any = [
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
  public info: any;
  private gridApi: any;
  public studentList: any;
  public addinList: any;
  public gridColumnApi: any;
  public pinnedBottomRowData: any;
  public getRowStyle: any;
  public startDate;
  public endDate;
  public campus: any;
  public campusList: any;
  public rooms: any;
  public homestayList: any;
  public programList: any = [];
  public program: any;
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
      .subscribe((res: any) => {
        this.studentList = (res as any).data.filter((row: any) => row.statusId !== 1030 && row.statusId !== 1036 && row.active);;
        this.createUIList(this.studentList);
      });
  };
  public createUIList(res: any) {
    const dates = this.enumerateDaysBetweenDates(this.startDate, this.endDate);
    const gridList: any = [];
    let total = 0;
    dates.forEach((date) => {
      const row = {
        date: date.toDateString(),
        in: res.filter(
          (el: any) =>
            new Date(el.arrivalDate).toLocaleDateString() ===
            date.toLocaleDateString()
        ).length,
        out: res.filter(
          (el: any) =>
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
    this.gridApi.setGridOption('rowData', gridList);
  }
  enumerateDaysBetweenDates = (startDate: any, endDate: any) => {
    const dates = [];
    dates.push(startDate);
    const currDate = moment(startDate).startOf("day");
    const lastDate = moment(endDate).startOf("day");

    while (currDate.add(1, "days").diff(lastDate) < 0) {
      dates.push(currDate.clone().toDate());
    }
    dates.push(endDate);
    return dates;
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
    if (this.startDate && this.endDate && !this.campus && !this.program) {
      this.createUIList(this.studentList);
    } else if (this.startDate && this.endDate && this.campus && !this.program) {
      const list = this.studentList.filter((el: any) => {
        return el.campusName === this.campus.campus;
      });
      this.createUIList(list);
    } else if (this.startDate && this.endDate && !this.campus && this.program) {
      const list = this.studentList.filter((el: any) => {
        return el.programName === this.program.programName;
      });
      this.createUIList(list);
    } else if (this.campus && this.program && this.startDate && this.endDate) {
      const list = this.studentList.filter((el: any) => {
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
