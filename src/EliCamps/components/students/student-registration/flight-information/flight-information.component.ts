import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group } from '@syncfusion/ej2-data';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ListService } from 'src/EliCamps/services/list.service';
import { Agent, Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { LocalstorageService } from 'src/EliCamps/services/localstorage.service';
import { SharedService } from 'src/EliCamps/services/shared.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-flight-information',
  templateUrl: './flight-information.component.html',
  styleUrls: ['./flight-information.component.css']
})
export class FlightInformationComponent implements OnInit, OnChanges, OnDestroy {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() student: Student;
  public registerForm: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public groupReuestModel: Group;
  public studentId: number;
  @Input() isEdit = false;
  public selectedAgent: Agent;
  public loading = false;
  public groupSubscription: Subscription;
  @Input() studentForm: FormGroup;
   public defaultColDef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public shared: SharedService,
    public taostr: ToastrService
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm; }
  ngOnInit() {
  }
  ngOnChanges(change: SimpleChanges) {
  }
  ngOnDestroy() {
  }
  public makeDatesSame(changeEvent: MatDatepickerInputEvent<any>, field: string) {
    const model = {
      value: changeEvent.value,
      field: field
    }
   this.dateChanged.emit(model)
  }
}
