/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Trip } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-trip-add-edit',
  templateUrl: './trip-add-edit.component.html',
  styleUrls: ['./trip-add-edit.component.css']
})
export class TripAddEditComponent implements OnInit {

  public registerForm!: FormGroup;
  public submitted = false;
  public id!: number;
  public isEdit = false;
  public loading = false;
  public selectedTrip!: Trip;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm; }
  ngOnInit() {
    this.getParams();
    this.initializeForm();
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params['id']) {
        this.id = Number(atob(params['id']));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedAgent(this.id);
        }
      }
    });
  }
  public getSelectedAgent = (id: number) => {
    this.listService.getTripById(id).subscribe((res: any) => {
      if (res) {
        this.selectedTrip = res;
        this.populateForm(this.selectedTrip);
      }

    });
  }
  public populateForm = (trip: any) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (trip[key]) {
          this.f.controls[key].setValue(trip[key]);
        }
      }
    });
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [],
      trips: [''],
      year: [],
      tripsDate: [''],
      notes: [''],
      camps: [''],
      ldx: [''],
      active: [true]
    });
  }

  Cancel_Click() {
    this.router.navigate(['/trips']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      const model = {
        ...this.f.value,
        tripId: this.f.controls['id'].value,
      };
      if (this.isEdit) {
        this.listService.updateTrips(model).subscribe((res: any) => {
          this.router.navigate(['/trips']);
          this.loading = false;
        }, (error: any) => {
          this.loading = false;
        });
      } else {
        delete model.id;
        delete model.tripId;
        this.listService.addTrip(model).subscribe((res: any) => {
          this.router.navigate(['/trips']);
          this.loading = false;
        }, (error: any) => {
          this.loading = false;
        });
      }
    }
  }

}
