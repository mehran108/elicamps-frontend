import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Agent, Group, Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { Location } from '@angular/common';
import { ListService } from 'src/EliCamps/services/list.service';
import { LocalstorageService } from 'src/EliCamps/services/localstorage.service';
import { SharedService } from 'src/EliCamps/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-medical-information',
  templateUrl: './medical-information.component.html',
  styleUrls: ['./medical-information.component.css']
})
export class MedicalInformationComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-ou@Input () student: Student;tput-on-prefix
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Input() student: Student;
  public registerForm: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public groupReuestModel: Group;
  public id: number;
  @Input() isEdit = false;
  public selectedAgent: Agent;
  public loading = false;
  @Input() studentForm: FormGroup;
   public defaultColDef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public storage: LocalstorageService,
    public shared: SharedService,
    public taostr: ToastrService
  ) {
  }
  // convenience getter for easy access to form fields
  ngOnInit() {
    this.initializeForm();
  }
  ngOnChanges(change: SimpleChanges) {
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      dietaryNeeds: [''],
      allergies: [''],
      medicalNotes: [''],
      medicalConditon: ['']
    });
  }
}
