/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRIP_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Trip } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-trip-manager',
  templateUrl: './trip-manager.component.html',
  styleUrls: ['./trip-manager.component.css']
})
export class TripManagerComponent implements OnInit {
 public defaultColDef;

  public tripForm!: FormGroup;
  public tripList: Trip[] = [];
  public submitted = false;
  public columnDefs: any = TRIP_COL_DEFS;
  public gridOptions: any;
  public rowData!: any[];
  public selectedTripList: Trip[] = [];
  public TripsModel: any;
  public selection: any = [];
  private gridApi: any;

  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<TripManagerComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
  }

  ngOnInit() {
    this.getTripList();
    this.initializeForm();
    this.groupService.getTripsMangerState().subscribe(res => {
      if (res) {
        this.TripsModel = res;
        this.tripForm.controls['Id'].setValue(this.TripsModel.id);
        this.tripForm.controls['refNumber'].setValue(this.TripsModel.grpRef);
        this.tripForm.controls['groupTrips'].setValue(this.TripsModel.groupTrips);

      }
    });
  }
  public getTripList = () => {
    this.listService.getAllTrips().subscribe(res => {
      this.tripList = res.data;
      if (this.data) {
        this.tripList = this.tripList.filter(trip =>
          new Date(this.data.departureDate || this.data.programEndDate) >= new Date(trip.tripsDate) &&
          new Date(this.data.arrivalDate || this.data.programStartDate) <= new Date(trip.tripsDate));
      }
      this.tripList.forEach((trip: Trip) => {
        trip['tripsDate'] = this.datePipe.transform(trip.tripsDate, 'short') || '';
      });
    });
  }
  initializeForm() {
    this.tripForm = this.formBuilder.group({
      Id: [null],
      refNumber: [null],
      groupTrips: []
    });
  }
  public addToList = () => {
    if (this.tripForm.controls['groupTrips'].value) {
      this.tripForm.controls['groupTrips'].value.forEach((id: any) => {
        const selectedTrip = this.tripList.find(res => res.id === id);
        if (selectedTrip)
        this.selectedTripList.push(selectedTrip);
      });
      this.gridOptions.api.setRowData(this.selectedTripList);
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }
  public onSubmit = () => {
    this.groupService.updateGrouptrips(this.tripForm.value).subscribe(res => {
      if (res) {
        this.dialogRef.close(true);
      }
    });

  }
  public refreshList = () => {
    this.tripForm.reset();
    this.selectedTripList = [];
    this.gridOptions.api.setRowData(this.selectedTripList);
  }
}
