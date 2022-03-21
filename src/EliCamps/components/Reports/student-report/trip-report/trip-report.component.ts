import { Component, OnInit } from '@angular/core';
import { TRIP_COL_DEFS, TRIP_REPORT_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { Trip, Campus } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ListService } from 'src/EliCamps/services/list.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.css']
})
export class TripReportComponent implements OnInit {
  public columnDefs = TRIP_REPORT_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public trips: Trip[];
  public modules = AllCommunityModules;
  public startDate: Date;
  public endDate: Date;
  public campus: Campus;
  public trip: Trip;
  public campusList: Campus[];
  public studentTripList = [];
  constructor(public router: Router, public listService: ListService) {
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
      this.studentTripList = res;
    });
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
    const params = {
      columnGroups: true,
      allColumns: true,
      fileName: `InsuranceReport${new Date().toLocaleString()}`,
    };
    this.gridApi.exportDataAsCsv(params);
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
