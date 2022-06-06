import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group, Agent } from '../../../EliCamps-Models/Elicamps';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agent-add-edit',
  templateUrl: './agent-add-edit.component.html',
  styleUrls: ['./agent-add-edit.component.css']
})
export class AgentAddEditComponent implements OnInit {
 public defaultColDef;


  public registerForm: FormGroup;
  public isPhoneNumberValid = true;
  public submitted = false;
  public phoneNumberRegex = /^([0-9]){9}$/;
  public agentList: Agent[] = [];
  public groupReuestModel: Group;
  public emailMaxChars = 50;
  public id: number;
  public isEdit = false;
  public selectedAgent: Agent;
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
    this.listService.getAgent(id).subscribe(res => {
      if (res) {
        this.selectedAgent = res;
        this.populateForm(this.selectedAgent);
      }

    });
  }
  public populateForm = (agent: Agent) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (agent[key]) {
          this.f.controls[key].setValue(agent[key]);
        }
      }
    });
  }
  public initializeDropDowns = () => {
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [],
      agent: [''],
      address: [''],
      contact: [''],
      email: ['', [Validators.maxLength(this.emailMaxChars), Validators.email]],
      notes: [''],
      country: [''],
      phone: [''],
      web: [''],
      other: ['other'],
      active: [true]
    });
  }

  Cancel_Click() {
    this.router.navigate(['/agents']);
  }
  onPhoneNumberChanged = () => {
    const value = this.registerForm.controls['phone'].value;
    this.isPhoneNumberValid = value.match(this.phoneNumberRegex);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      const model = {
        ...this.f.value,
       agentId: this.f.controls.id.value,
      };
      if (this.isEdit) {
        this.listService.updateAgent(model).subscribe(res => {
          this.router.navigate(['/agents']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      } else {
        delete model.id;
        this.listService.addAgent(model).subscribe(res => {
          this.router.navigate(['/agents']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      }
    }
  }

}
