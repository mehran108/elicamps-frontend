import { Component, OnInit } from '@angular/core';
import { TRIP_COL_DEFS, TRIP_REPORT_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { Trip, Campus } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ListService } from 'src/EliCamps/services/list.service';
import { throwError } from 'rxjs';
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.css']
})
export class TripReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs = TRIP_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public trips: Trip[];
  public modules = AllModules;
  public startDate: Date;
  public endDate: Date;
  public campus: Campus;
  public trip: Trip;
  public campusList: Campus[];
  public studentTripList = [];
  public statusList = [];
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
      active: true
    };
    const campuseResponse = await this.listService.getAllCampus(params).toPromise().catch(error => throwError(error));
    if (campuseResponse) {
      this.campusList = campuseResponse.data;
    }
    const tripResponse = await this.listService.getAllTrips().toPromise().catch(error => throwError(error));
    if (tripResponse) {
      this.trips = tripResponse.data;
    }
    this.getAgentList();
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getInsuranceReport().subscribe(res => {
      this.studentTripList = res.map(row => ({
        ...row,
        status: this.getStatus(row),
      }));
      this.studentTripList = this.studentTripList.sort((a, b) =>
      a.active > b.active ? -1 : 0
    );
    let changedEvent: MatSelectChange = {
      source: null,
      value: 'Active',
    };
    this.filterStudents(changedEvent);
    });
  }
  public getStatus(row) {
    const statusRow = this.statusList.find((el) => el.id === row.statusId);
    if (row.programeEndDate && new Date(row.programeEndDate) <= new Date()) {
      return "Past";
    } else if (statusRow) {
      return statusRow.name;
    } else {
      return "Active";
    }
  }
  filterStudents(changeEvent: MatSelectChange) {
    if (changeEvent.value) {
      this.studentTripList = this.studentTripList.filter(
        (row) => row.status === changeEvent.value
      );
      this.gridApi.setRowData(this.studentTripList);
    } else {
      this.gridApi.setRowData(this.studentTripList);
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }
  public filterChage = () => {
    let filteredList = [];
    if (this.campus) {
      filteredList = this.studentTripList.filter(row => {
        return row.campusName === this.campus.campus;
      });
    }
    if (this.trip) {
      filteredList = this.studentTripList.filter(row => {
        return row.studentTrips.find(trip => trip === this.trip) ? true : false;
      });
    }
    if (this.campus && this.trip && this.endDate) {
      filteredList = this.studentTripList.filter(row => {
        return row.campus === this.campus && new Date(row.programEndDate) > new Date(this.trip.tripsDate)
          && row.studentTrips.find(trip => trip === this.trip);
      });
    }
    this.gridOptions.api.setRowData(filteredList);
  }
  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Trips_Report')
  }
  public filterData = () => {
    let filteredList = this.studentTripList;
    if (this.campus) {
      filteredList = filteredList.filter(row => {
        return row.campusName === this.campus.campus;
      });
    }
    if (this.endDate) {
      filteredList = filteredList.filter(row => new Date(row.tripsDate) <= this.endDate)
    }
    if (this.trip) {
      filteredList = filteredList.filter(el => el.studentTrips.includes(this.trip.id));
    }
    if (this.endDate && this.campus) {
      filteredList = filteredList.filter(row =>
        new Date(row.tripsDate) === this.endDate
        && row.campusName === this.campus.campus
      )
    }
    this.gridOptions.api.setRowData(filteredList);
  }
  clear = () => {
    this.trip = null;
    this.endDate = null;
    this.campus = null;
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.setRowData(this.studentTripList);
  }
}
