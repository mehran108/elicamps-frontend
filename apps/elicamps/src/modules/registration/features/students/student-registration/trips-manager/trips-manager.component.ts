/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { TRIP_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Student, Trip } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
@Component({
  selector: 'app-trips-manager',
  templateUrl: './trips-manager.component.html',
  styleUrls: ['./trips-manager.component.css'],
})
export class TripsManagerComponent implements OnInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() studentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Input() student!: Student;
  @Input() studentForm!: FormGroup;
  public tripForm!: FormGroup;
  public tripList: Trip[] = [];
  public submitted = false;
  public columnDefs: any = TRIP_COL_DEFS;
  public gridOptions: any;
  public rowData!: any[];
  public selectedTripList: Trip[] = [];
  public TripsModel: any;
  public selection: any;
  private gridApi: any;
  @Input() isEdit = false;
  public selectedIndex = 8;
  public studentId!: number;
  constructor(
    private formBuilder: FormBuilder,
    private listService: ListService,
    public groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public shared: SharedService,
    public toastr: ToastrService,
    public location: Location
  ) {}
  get f() {
    return this.tripForm;
  }

  ngOnInit() {
    this.getTripList();
  }
  public getTripList = () => {
    this.listService.getAllTrips().subscribe((res) => {
      this.tripList = res.data;
      if (res.data && this.student) {
        this.tripList = this.tripList.filter(
          (trip) =>
            new Date(
              this.student.departureDate || this.student.programeEndDate
            ) >= new Date(trip.tripsDate) &&
            new Date(
              this.student.arrivalDate || this.student.programeStartDate
            ) <= new Date(trip.tripsDate)
        );
      }
      this.tripList.forEach((trip: any) => {
        trip.tripsDate = this.datePipe.transform(trip.tripsDate, 'short');
      });
    });
  };
  Cancel_Click() {
    this.router.navigate(['/students']);
  }
  public addToList = () => {
    if (this.studentForm.controls['studentTrips'].value) {
      this.studentForm.controls['studentTrips'].value.forEach((id: any) => {
        const selectedTrip = this.tripList.find((res) => res.id === id);
        if (selectedTrip) this.selectedTripList.push(selectedTrip);
      });
      this.gridOptions.api.setRowData(this.selectedTripList);
    }
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }
  public onSubmit = () => {
    this.submitted = true;
    if (this.isEdit === false) {
      this.shared.setTripsManagerInfoState(this.f.value);
      this.studentRegistration.emit(this.selectedIndex);
    } else if (this.isEdit === true) {
      const model = {
        ...this.student,
        ...this.f.value,
      };
      this.listService.updateStudentInfo(model).subscribe((res) => {
        this.toastr.success('Trip Information Section Updated', 'Success');
      });
    }
  };
  public refreshList = () => {
    this.tripForm.reset();
    this.selectedTripList = [];
    this.gridOptions.api.setRowData(this.selectedTripList);
  };
  public saveAndClose = () => {
    const data = this.shared.getCompleteState();
    data.arrivalTime = data.arrivalTime
      ? moment(data.arrivalTime).format('YYYY-MM-DD HH:mm:ss')
      : '';
    data.flightDepartureTime = data.flightDepartureTime
      ? moment(data.flightDepartureTime).format('YYYY-MM-DD HH:mm:ss')
      : '';
    data.programeStartDate = data.programeStartDate
      ? moment(data.programeStartDate).format('MM/DD/YYYY')
      : '';
    data.programeEndDate = data.programeEndDate
      ? moment(data.programeEndDate).format('MM/DD/YYYY')
      : '';
    data.arrivalDate = data.arrivalDate
      ? moment(data.arrivalDate).format('MM/DD/YYYY')
      : '';
    data.departureDate = data.departureDate
      ? moment(data.departureDate).format('MM/DD/YYYY')
      : '';
    if (!this.isEdit) {
      const studentInfo = this.shared.getStudentInfoState();
      const flightInfo = this.shared.getflightInfotate();
      const medicalInfo = this.shared.getmedicalInfotate();
      const programInfo = this.shared.getProgramInfoState();
      const model = {
        ...studentInfo,
        ...flightInfo,
        ...medicalInfo,
        ...programInfo,
      };
      this.listService.addStudentInfo(model).subscribe((res) => {
        data.id = res;
        this.listService.updateStudentInfo(data).subscribe((update) => {
          this.location.back();
        });
      });
    } else {
      this.listService.updateStudentInfo(data).subscribe((res) => {
        this.location.back();
      });
    }
  };
}
