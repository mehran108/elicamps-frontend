import { Component, OnInit, Pipe } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Campus, HomeStay } from '../../../EliCamps-Models/Elicamps';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
// tslint:disable-next-line: use-pipe-transform-interface
@Component({
  selector: 'app-add-edit-homestay',
  templateUrl: './add-edit-homestay.component.html',
  styleUrls: ['./add-edit-homestay.component.css']
})
export class AddEditHomestayComponent implements OnInit {
 public defaultColDef;

  // tslint:disable-next-line: max-line-length
  public registerForm: FormGroup;
  public submitted = false;
  public campusList: Campus[] = [];
  public isEdit = false;
  public id: number;
  public loading = false;
  public selectedHomeStay: HomeStay;
  public lookupList = [{ value: true, name: 'Yes' }, { value: false, name: 'No' }];
  public preferenceList = [{ value: 1, name: 'Male' }, { value: 2, name: 'Female' }, { value: 3, name: 'No Preference' }];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public sanitizer: DomSanitizer
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
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedHomestay(this.id);
        }
      }
    });
  }
  public getSelectedHomestay = (id: number) => {
    this.listService.getHomeStay(id).subscribe(res => {
      if (res) {
        this.selectedHomeStay = res;
        this.populateForm(this.selectedHomeStay);
      }

    });
  }
  public populateForm = (homeStay: HomeStay) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (homeStay[key]) {
          this.f.controls[key].setValue(homeStay[key]);
        }
      }
    });
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      homeId: [0],
      reference: [null],
      name: [null],
      cellNumber: [null],
      email: [null],
      address: [null],
      region: [null],
      intersection: [null],
      distance: [],
      meals: [null],
      prefer: [null],
      rooms: [null],
      aggrements: [null],
      policeCheck: [null],
      homeStayLocationURL: [],
      active: [false],
    });
  }
  Cancel_Click() {
    this.router.navigate(['/homestays']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.listService.updateHomeStay(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/homestays']);
          }
        }, error => {
          this.loading = false;
        });
      } else {
        this.listService.addHomeStay(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/homestays']);
          }
        }, error => {
          this.loading = false;
        });
      }

    }
  }

}
