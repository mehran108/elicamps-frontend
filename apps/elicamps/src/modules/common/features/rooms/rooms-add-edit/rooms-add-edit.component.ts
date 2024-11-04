/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Campus, Room } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-rooms-add-edit',
  templateUrl: './rooms-add-edit.component.html',
  styleUrls: ['./rooms-add-edit.component.css']
})
export class RoomsAddEditComponent implements OnInit {

  public registerForm!: FormGroup;
  public submitted = false;
  public campusList: Campus[] = [];
  public isEdit = false;
  public id!: number;
  public selectedRoom!: Room;
  public loading = false;
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
    this.initializeDropDowns();
    this.initializeForm();
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params['id']) {
        this.id = Number(atob(params['id']));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedRoom(this.id);
        }
      }
    });
  }
  public getSelectedRoom = (id: number) => {
    this.listService.getRoomById(id).subscribe((res: any) => {
      if (res) {
        this.selectedRoom = res;
        this.populateForm(this.selectedRoom);
      }

    });
  }
  public populateForm = (room: Room) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (room[key]) {
          this.f.controls[key].setValue(room[key]);
        }
      }
    });
  }
  public initializeDropDowns = () => {
    const params = {
      active: true
    };
    this.listService.getAllCampus(params).subscribe((res: any) => {
      this.campusList = (res as any).data;
    });
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [0],
      roomID: [''],
      campusID: [''],
      building: [''],
      roomType: [''],
      floor: [''],
      ldx: ['abc'],
      notes: ['', ],
      bookedFrom: [null],
      bookedTo: [null],
      available: [true],
      availableFrom: [null],
      availableTo: [null],
      importedOne: [0],
      weekno: ['week'],
      year: ['2019'],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/rooms']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        const model = {
          id: this.selectedRoom['id'],
          ...this.f.value
        };
        this.listService.updateRoom(model).subscribe((res: any) => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/rooms']);
          }
        });
      } else {
        const model = {
          ...this.f.value
        };
        delete model.id;
        this.listService.addRoom(this.f.value).subscribe((res: any) => {
          this.loading = false;
          this.router.navigate(['/rooms']);
        });
      }
    }
  }

}
