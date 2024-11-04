/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { MatSelectChange } from "@angular/material/select";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { TRIP_REPORT_COL_DEFS } from "apps/elicamps/src/common/elicamps-column-definitions";
import { LookupEnum } from "apps/elicamps/src/common/lookup.enums";
import { Trip, Campus } from "apps/elicamps/src/models/Elicamps";
import { ListService } from "apps/elicamps/src/services/list.service";

@Component({
  selector: "app-trip-report",
  templateUrl: "./trip-report.component.html",
  styleUrls: ["./trip-report.component.css"],
})
export class TripReportComponent implements OnInit {
  public columnDefs: any = TRIP_REPORT_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public trips!: Trip[];
  public startDate!: Date;
  public endDate!: any;
  public campus!: any;
  public trip!: any;
  public campusList!: Campus[];
  public studentTripList: any;;
  public statusList: any = [];
  public selectedStatus = "Active";
  public defaultColDef: any
  constructor(public router: Router, public listService: ListService) {
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
    this.getAgentList();
    this.getCampusList();
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.statusList = res;
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
    const tripResponse = await this.listService
      .getAllTrips()
      .toPromise()
      .catch((error) => throwError(error));
    if (tripResponse) {
      this.trips = tripResponse.data;
    }
    this.getAgentList();
  };
  public getAgentList = () => {
    const params = {
      active: true,
    };
    this.listService.getInsuranceReport().subscribe((res) => {
      this.studentTripList = res.map((row: any) => ({
        ...row,
        status: this.getStatus(row),
      }));
      this.studentTripList = this.studentTripList.sort((a: any, b: any) =>
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
      this.studentTripList = this.studentTripList.filter(
        (row: any) => row.status === changeEvent.value
      );
      this.gridApi.setRowData(this.studentTripList);
    } else {
      this.gridApi.setRowData(this.studentTripList);
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }
  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, "Trips_Report");
  }
  public filterData = () => {
    let filteredList = this.studentTripList;
    if (this.campus) {
      filteredList = filteredList.filter((row: any) => {
        return row.campusName === this.campus.campus;
      });
    }
    if (this.endDate) {
      filteredList = filteredList.filter(
        (row: any) => new Date(row.tripsDate) <= this.endDate
      );
    }
    if (this.trip) {
      filteredList = filteredList.filter((el: any) =>
        el.studentTrips.includes(this.trip.id)
      );
    }
    if (this.selectedStatus) {
      filteredList = filteredList.filter(
        (row: any) => row.status === this.selectedStatus
      );
    }
    if (this.endDate && this.campus) {
      filteredList = filteredList.filter(
        (row: any) =>
          new Date(row.tripsDate) == this.endDate &&
          row.campusName === this.campus.campus
      );
    }
    this.gridOptions.api.setRowData(filteredList);
  };
  clear = () => {
    this.trip = null;
    this.endDate = null;
    this.campus = null;
    this.selectedStatus = 'Active'
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.filterData();
  };
}
