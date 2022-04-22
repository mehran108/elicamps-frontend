import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agent, Group, LookupTable, TripsMangerModel } from '../../../EliCamps-Models/Elicamps';
import { GroupService } from '../../../services/group.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripManagerComponent } from './trip-manager/trip-manager.component';
import { GroupProgrameComponent } from './group-programe/group-programe.component';
import { GroupPaymentComponent } from './group-payment/group-payment.component';
import { ListService } from '../../../services/list.service';
import { LookupEnum } from '../../../common/lookup.enums';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-group-add-edit',
  templateUrl: './group-add-edit.component.html',
  styleUrls: ['./group-add-edit.component.css']
})
export class GroupAddEditComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public selectedGroup: Group;
  public groupId: number;
  public isEdit = false;
  public loading = false;
  public campList: LookupTable[] = [];
  public yearList = [{ value: 2019, name: '2019' }, { value: 2020, name: '2020' }];
  public invoiceTypeList = [{ value: 'Gross', name: 'Gross' }, { value: 'Net', name: 'Net' }];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public groupService: GroupService,
    public dialog: MatDialog,
    public listService: ListService,
    public location: Location,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm; }
  ngOnInit() {
    this.getParams();
    this.initializeDropDowns();
    this.initializeForm();
  }
  /**
   * Open Trip Manager Dialog
   */
  openTripDialog(): void {
    const dialogRef = this.dialog.open(TripManagerComponent, {
      data: this.selectedGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSelectedGroup(this.groupId);
      }
    });
  }
  openProgrameDialog(): void {
    const dialogRef = this.dialog.open(GroupProgrameComponent, {
      data: this.selectedGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSelectedGroup(this.groupId);
      }
    });
  }
  openPaymentDialog(): void {
    const dialogRef = this.dialog.open(GroupPaymentComponent, {
      data: this.selectedGroup
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSelectedGroup(this.groupId);
      }
    });
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.groupId) {
        this.groupId = Number(atob(params.groupId));
        if (this.groupId) {
          this.isEdit = true;
          this.getSelectedGroup(this.groupId);
        }
      }
    });
  }
  public getSelectedGroup = (groupId: number) => {
    this.loading = true;
    this.groupService.getElicampsGroup(groupId).subscribe((group: Group) => {
      if (group) {
        const groupModel: TripsMangerModel = {
          id: group.id,
          grpRef: group.refNumber,
          groupTrips: group.groupTrips
        };
        this.groupService.setTripsMangerState(groupModel);
        this.loading = false;
        this.selectedGroup = group;
        this.populateGroupForm(group);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
  public populateGroupForm = (group: Group) => {
    const keys = ['arrivalTime', 'flightDepartureTime'];
    Object.keys(this.f.controls).forEach(key => {
      if (group[key] && !this.f.controls[key].value && !keys.includes(key)) {
        this.f.controls[key].setValue(group[key]);
      }
    });
    keys.forEach(key => {
      if (group[key]) {
        const dateTime = moment(group[key]);
        this.f.controls[key].setValue(dateTime.toDate());
      }
    });
  }
  public initializeDropDowns = () => {
    const params = {
      active: true
    };
    this.listService.getAllAgent(params).subscribe(res => {
      this.agentList = res.data;
    });
    this.listService.getAll(LookupEnum.CAMPS).subscribe(res => {
      this.campList = res;
    });
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [0],
      year: [new Date().getFullYear()],
      camps: [''],
      refNumber: [''],
      agentID: [''],
      agencyRef: [''],
      country: [''],
      arrivalDate: ['', Validators.required],
      terminal: [''],
      flightNumber: [],
      destinationFrom: [''],
      arrivalTime: [''],
      departureDate: ['', Validators.required],
      departureTerminal: [''],
      departureFlightNumber: [''],
      destinationTo: [''],
      flightDepartureTime: [''],
      invoiceType: [''],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/groups']);
  }
  selectValue = (value) => {
    if (value) {
      const agentToFind = this.agentList.find(agent => agent.id === value);
      if (agentToFind) {
        this.f.controls.country.setValue(agentToFind.country);
      }
    }
  }
  public navigateToInvoice = () => {
    // tslint:disable-next-line: max-line-length
    window.open(`${environment.appURL}/#/group-invoice?groupId=${btoa(this.groupId.toString())}&type=${this.f.controls.invoiceType.value}&invoiceType=${this.f.controls.invoiceType.value}`);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.spinner.show();
      // const arrivalTime = this.f.controls.arrivalTime.value ? moment(this.f.controls.arrivalTime.value).format('HH:mm:ss') : '';
      // // tslint:disable-next-line: max-line-length
      // const departureTime = this.f.controls.flightDepartureTime.value ? moment(this.f.controls.flightDepartureTime.value).format('HH:mm:ss') : '';
      const arrivalDate = this.f.controls.arrivalDate.value ? moment(this.f.controls.arrivalDate.value).format('MM/DD/YYYY') : '';
      // tslint:disable-next-line: max-line-length
      const departureDate = this.f.controls.departureDate.value ? moment(this.f.controls.departureDate.value).format('MM/DD/YYYY') : '';
      const model = {
        ...this.f.value
      };
      // model.arrivalTime = arrivalTime;
      // model.flightDepartureTime = departureTime;
      model.arrivalDate = arrivalDate;
      model.departureDate = departureDate;
      if (this.isEdit) {
        this.groupService.updateElicampsGroups(model).subscribe(res => {
          if (res) {
            this.spinner.hide();
            this.toastr.success('Success', 'Group Updated Successfully');
            this.getParams();
          }
        }, error => {
          this.spinner.hide();
        });
      } else {
        this.groupService.addElicampsGroup(model).subscribe(res => {
          if (res) {
            this.spinner.hide();
            this.router.navigate(['addGroup'], {
              queryParams: {
                groupId: btoa(res.toString())
              }
            });
          }
        }, error => {
          this.spinner.hide();
        });
      }
    }
  }
  getGroupId() {
    if (this.groupId) {
      return btoa(this.groupId.toString());
    }
  }
}
