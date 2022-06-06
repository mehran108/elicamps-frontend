import { Group, StudentDocuments } from './../../../../EliCamps-Models/Elicamps';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupTable, Agent, Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/EliCamps/services/group.service';
import { MatDialog } from '@angular/material';
import { TripManagerComponent } from 'src/EliCamps/components/groups/group-add-edit/trip-manager/trip-manager.component';
import { GroupProgrameComponent } from 'src/EliCamps/components/groups/group-add-edit/group-programe/group-programe.component';
import { GroupPaymentComponent } from 'src/EliCamps/components/groups/group-add-edit/group-payment/group-payment.component';
import { LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { ListService } from 'src/EliCamps/services/list.service';
import { Location } from '@angular/common';
import { LocalstorageService } from 'src/EliCamps/services/localstorage.service';
import { SharedService } from 'src/EliCamps/services/shared.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentInformationComponent implements OnInit, OnChanges, OnDestroy {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() getBygroup: EventEmitter<any> = new EventEmitter<any>();
  @Input() student: Student;
  @Input() studentForm: FormGroup;
  @Input() groupList = [];
  @Input() statusList = [];
  public studentRegisterForm: FormGroup;
  public submitted = false;
  @Input() agentList: Agent[] = [];
  public documentId = null;
  public selectedGroup: Group;
  public studentId: number;
  @Input() isEdit = false;
  public loading = false;
  public selectedStudent: Student;
  @Input() campList: LookupTable[] = [];
  public yearList = [{ value: 2020, name: '2020' }, { value: 2021, name: '2021' }];
  public genderList = [{ value: 1, name: 'Male' }, { value: 2, name: 'Female' }];
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
   public defaultColDef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public groupService: GroupService,
    public dialog: MatDialog,
    public listService: ListService,
    public location: Location,
    public storage: LocalstorageService,
    public shared: SharedService,
    public toastr: ToastrService
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.studentRegisterForm; }
  ngOnInit() {
    this.initializeDropDowns();
  }
ngOnDestroy(): void {}
  ngOnChanges(change: SimpleChanges) {
    if (change && change.studentForm && change.studentForm.currentValue) {
      this.studentForm = change.studentForm.currentValue;
      this.calculateAge();
    }
  }
  selectValue = (value) => {
    if (value) {
      const agentToFind = this.agentList.find(agent => agent.id === value);
      if (agentToFind) {
        this.studentForm.controls.country.setValue(agentToFind.country);
      }
    }
  }
  public initializeDropDowns = () => {
  }
  public getBygroupId = () => {
    this.getBygroup.emit(true);
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.upload();
    };
  }
  public calculateAge = () => {
    const now = moment(new Date()); // todays date
    const duration = moment.duration(now.diff(this.studentForm.controls.dob.value));
    const years = duration.asYears();
    if (years) {
      this.studentForm.controls.age.setValue(Math.floor(years));
    }
  }

  upload() {

    const model: any = {
      ProfilePic: this.fileData
    };
    this.listService.uploadStudentProfile(model).subscribe(res => {
      if (res) {
        this.documentId = +res;
      }
    });

  }
  displayFn(value) {
    return value;
  }
}
