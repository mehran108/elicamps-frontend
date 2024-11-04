/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Student, Group } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
import { Agent } from 'http';

@Component({
  selector: 'app-flight-information',
  templateUrl: './flight-information.component.html',
  styleUrls: ['./flight-information.component.css']
})
export class FlightInformationComponent {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() studentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() student!: Student;
  public registerForm!: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public groupReuestModel!: Group;
  public studentId!: number;
  @Input() isEdit = false;
  public selectedAgent!: Agent;
  public loading = false;
  public groupSubscription!: Subscription;
  @Input() studentForm!: FormGroup;
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
  public makeDatesSame(changeEvent: MatDatepickerInputEvent<any>, field: string) {
    const model = {
      value: changeEvent.value,
      field: field
    }
   this.dateChanged.emit(model)
  }
}
