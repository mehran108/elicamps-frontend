import { SharedService } from 'src/EliCamps/services/shared.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Agent,
  Group,
  LookupTable,
  Student,
  SubProgram,
  Program,
  Campus
} from 'src/EliCamps/EliCamps-Models/Elicamps';
import { ListService } from 'src/EliCamps/services/list.service';
import { Location } from '@angular/common';
import { LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { LocalstorageService } from 'src/EliCamps/services/localstorage.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent, MatSelectChange } from '@angular/material';
@Component({
  selector: 'app-program-information',
  templateUrl: './program-information.component.html',
  styleUrls: ['./program-information.component.css']
})
export class ProgramInformationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() student: Student;
  @Input() studentForm: FormGroup;
  @Input() chapProgramList: LookupTable[] = [];
  @Input() programList: Program[] = [];
  @Input() subProgramList: SubProgram[] = [];
  @Input() formatList: LookupTable[] = [];
  @Input() campusList: Campus[] = [];
  @Input() mealPlanList: LookupTable[] = [];
  @Input() addinsList: [] = [];
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() programUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() calcNumOfNights: EventEmitter<any> = new EventEmitter<any>();
  @Output() subProg: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();

  public registerForm: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public groupReuestModel: Group;
  public studentId: number;
  @Input() isEdit = false;
  public selectedAgent: Agent;
  public loading = false;
  public selectedIndex = 4;
  public groupSubscription: Subscription;
  public shareObservable: Subscription;

   public defaultColDef;
  constructor(
    private router: Router,
    public listService: ListService,
    public location: Location,
    public shared: SharedService,
    public toastr: ToastrService
  ) { }
  // convenience getter for easy access to form fields
  ngOnInit() {
  }
  ngOnChanges(change: SimpleChanges) {
  }
  ngOnDestroy() {
  }
  public getSubProgram = (program) => {
    this.subProg.emit(program)
  }
  calculateNumberOfNights(value) {
    this.calcNumOfNights.emit(value);
  }
  public makeDatesSame(changeEvent: MatDatepickerInputEvent<any>, field: string) {
    const model = {
      value: changeEvent.value,
      field: field
    }
   this.dateChanged.emit(model)
  }
  campusSelected(selectedCampusEvent:MatSelectChange) {
      this.studentForm.controls.roomSearchCampus.setValue(selectedCampusEvent.value);
  }
}
