import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Trip } from '../../../../EliCamps-Models/Elicamps';
import { ListService } from '../../../../services/list.service';
import { TRIP_COL_DEFS } from '../../../../common/elicamps-column-definitions';
import { DatePipe } from '@angular/common';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { GroupService } from 'src/EliCamps/services/group.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-trip-manager',
  templateUrl: './trip-manager.component.html',
  styleUrls: ['./trip-manager.component.css']
})
export class TripManagerComponent implements OnInit {
 public defaultColDef;

  public tripForm: FormGroup;
  public tripList: Trip[] = [];
  public submitted = false;
  public columnDefs = TRIP_COL_DEFS;
  public gridOptions: any;
  public rowData: any[];
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
this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
      }
    };
  }

  ngOnInit() {
    this.getTripList();
    this.initializeForm();
    this.groupService.getTripsMangerState().subscribe(res => {
      if (res) {
        this.TripsModel = res;
        this.tripForm.controls.Id.setValue(this.TripsModel.id);
        this.tripForm.controls.refNumber.setValue(this.TripsModel.grpRef);
        this.tripForm.controls.groupTrips.setValue(this.TripsModel.groupTrips);

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
        trip.tripsDate = this.datePipe.transform(trip.tripsDate, 'short');
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
    if (this.tripForm.controls.groupTrips.value) {
      this.tripForm.controls.groupTrips.value.forEach(id => {
        const selectedTrip = this.tripList.find(res => res.id === id);
        this.selectedTripList.push(selectedTrip);
      });
      this.gridOptions.api.setRowData(this.selectedTripList);
    }
  }
  onGridReady(params) {
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
