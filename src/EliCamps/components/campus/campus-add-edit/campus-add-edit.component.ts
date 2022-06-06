import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProgrameAddins, LookupTable, Campus } from '../../../EliCamps-Models/Elicamps';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { LookupEnum } from '../../../common/lookup.enums';
import { Location } from '@angular/common';

@Component({
  selector: 'app-campus-add-edit',
  templateUrl: './campus-add-edit.component.html',
  styleUrls: ['./campus-add-edit.component.css']
})
export class CampusAddEditComponent implements OnInit {
 public defaultColDef;


  public campusForm: FormGroup;
  public submitted = false;
  public id: number;
  public isEdit = false;
  public selectedCampus: Campus;
  public CampussTypeList: LookupTable[] = [];
  public campsList: LookupTable[] = [];
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
  get f() { return this.campusForm; }
  ngOnInit() {
    this.getParams();
    this.initializeDropDowns();
    this.initializeForm();
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedAgent(this.id);
        }
      }
    });
  }
  public getSelectedAgent = (id: number) => {
    this.listService.getCampus(id).subscribe(res => {
      if (res) {
        this.selectedCampus = res;
        this.populateForm(this.selectedCampus);
      }

    });
  }
  public populateForm = (agent: Campus) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (agent[key]) {
          this.f.controls[key].setValue(agent[key]);
        }
      }
    });
  }
  public initializeDropDowns = () => {
    this.listService.getAll(LookupEnum.CAMPS).subscribe(res => {
      this.campsList = res;
    });
  }
  initializeForm() {
    this.campusForm = this.formBuilder.group({
      id: [0],
      campus: [''],
      camps: [''],
      completeName: [''],
      addressOnReports: [''],
      onelineaddress: [''],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/campus']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.listService.updateCampus(this.f.value).subscribe(res => {
          this.loading = false;
          this.router.navigate(['/campus']);
        }, error => {
          this.loading = false;
        });
      } else {
        this.listService.addCampus(this.f.value).subscribe(res => {
          this.loading = false;
          this.router.navigate(['/campus']);
        }, error => {
          this.loading = false;
        });
      }

    }
  }

}
