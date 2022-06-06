import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProgrameAddins, LookupTable } from '../../../EliCamps-Models/Elicamps';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { LookupEnum } from '../../../common/lookup.enums';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-addins',
  templateUrl: './add-edit-addins.component.html',
  styleUrls: ['./add-edit-addins.component.css']
})
export class AddEditAddinsComponent implements OnInit {

  public addinForm: FormGroup;
  public submitted = false;
  public id: number;
  public isEdit = false;
  public selectedAddin: ProgrameAddins;
  public addinsTypeList: LookupTable[] = [];
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
  get f() { return this.addinForm; }
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
    this.listService.getAddins(id).subscribe(res => {
      if (res) {
        this.selectedAddin = res;
        this.populateForm(this.selectedAddin);
      }

    });
  }
  public populateForm = (agent: ProgrameAddins) => {
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
    this.listService.getAll('AddinType').subscribe(res => {
      this.addinsTypeList = res;
    });
  }
  initializeForm() {
    this.addinForm = this.formBuilder.group({
      id: [0],
      addins: [''],
      isDefault: [false],
      camps: [''],
      addinsType: [''],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/addins']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.listService.updateAddins(this.f.value).subscribe(res => {
          this.loading = false;
          this.router.navigate(['/addins']);
        }, error => {
          this.loading = false;
        });
      } else {
        this.listService.addAddins(this.f.value).subscribe(res => {
          this.loading = false;
          this.router.navigate(['/addins']);
        }, error => {
          this.loading = false;
        });
      }

    }
  }

}
