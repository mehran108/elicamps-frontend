/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { Student, LookupTable, Program, SubProgram, Campus, Group } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
import { Agent } from 'http';
@Component({
  selector: 'app-program-information',
  templateUrl: './program-information.component.html',
  styleUrls: ['./program-information.component.css']
})
export class ProgramInformationComponent {
  @Input() student!: Student;
  @Input() studentForm!: FormGroup;
  @Input() chapProgramList: LookupTable[] = [];
  @Input() programList: Program[] = [];
  @Input() subProgramList: SubProgram[] = [];
  @Input() formatList: LookupTable[] = [];
  @Input() campusList: Campus[] = [];
  @Input() mealPlanList: LookupTable[] = [];
  @Input() addinsList: [] = [];
  // tslint:disable-next-line: no-output-on-prefix
  @Output() studentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() programUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() calcNumOfNights: EventEmitter<any> = new EventEmitter<any>();
  @Output() subProg: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateChanged: EventEmitter<any> = new EventEmitter<any>();

  public registerForm!: FormGroup;
  public submitted = false;
  public agentList: Agent[] = [];
  public groupReuestModel!: Group;
  public studentId!: number;
  @Input() isEdit = false;
  public selectedAgent!: Agent;
  public loading = false;
  public selectedIndex = 4;
  public groupSubscription!: Subscription;
  public shareObservable!: Subscription;
  constructor(
    private router: Router,
    public listService: ListService,
    public location: Location,
    public shared: SharedService,
    public toastr: ToastrService
  ) { }
  public getSubProgram = (program: any) => {
    this.subProg.emit(program)
  }
  calculateNumberOfNights(value: any) {
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
      this.studentForm.controls['roomSearchCampus'].setValue(selectedCampusEvent.value);
  }
}
