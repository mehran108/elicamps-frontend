import { Component, OnInit } from '@angular/core';
import { Program } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from 'src/EliCamps/services/list.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-edit-program',
  templateUrl: './add-edit-program.component.html',
  styleUrls: ['./add-edit-program.component.css']
})
export class AddEditProgramComponent implements OnInit {

  public registerForm: FormGroup;
  public submitted = false;
  public isEdit = false;
  public id: number;
  public loading = false;
  public selectedProgram: Program;
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
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedProgram(this.id);
        }
      }
    });
  }
  public getSelectedProgram = (id: number) => {
    this.listService.getProgram(id).subscribe(res => {
      if (res) {
        this.selectedProgram = res;
        this.populateForm(this.selectedProgram);
      }

    });
  }
  public populateForm = (program: Program) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (program[key]) {
          this.f.controls[key].setValue(program[key]);
        }
      }
    });
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [0],
      programName: [''],
      isDefault: [false],
      active: [true],
    });
  }

  Cancel_Click() {
    this.router.navigate(['/programs']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      if (this.isEdit) {
        this.listService.updateProgram(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/programs']);
          }
        }, error => {
          this.loading = false;
        });
      } else {
        this.listService.addProgram(this.f.value).subscribe(res => {
          if (res) {
            this.loading = false;
            this.router.navigate(['/programs']);
          }
        }, error => {
          this.loading = false;
        });
      }

    }
  }

}
