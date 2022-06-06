import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SubProgram, Program } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from 'src/EliCamps/services/list.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-sub-program',
  templateUrl: './add-edit-sub-program.component.html',
  styleUrls: ['./add-edit-sub-program.component.css']
})
export class AddEditSubProgramComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted = false;
  public isEdit = false;
  public id: number;
  public loading = false;
  public selectedSubProgram: SubProgram;
  public programList: Program[] = [];
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
    const params = {
      active: true
    };
    this.listService.getAllProgram(params).subscribe(res => {
      this.programList = res.data || [];
    });
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedSubProgram(this.id);
        }
      }
    });
  }
  public getSelectedSubProgram = (id: number) => {
    this.listService.getSubProgram(id).subscribe(res => {
      if (res) {
        this.selectedSubProgram = res;
        this.populateForm(this.selectedSubProgram);
      }
    });
  }
  public populateForm = (subProgram: SubProgram) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (subProgram[key]) {
          this.f.controls[key].setValue(subProgram[key]);
        }
      }
    });
    this.selectSubProgram(subProgram.programID);
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [0],
      programID: [],
      programName: [''],
      subProgramName: [''],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/subPrograms']);
  }
  public selectSubProgram = (value) => {
    const program = this.programList.find(found => found.id === value);
    this.f.controls.programName.setValue(program.programName);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.listService.updateSubProgram(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/subPrograms']);
          }
        }, error => {
          this.loading = false;
        });
      } else {
        this.listService.addSubProgram(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/subPrograms']);
          }
        }, error => {
          this.loading = false;
        });
      }

    }
  }

}
