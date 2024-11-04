/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Student, Group, LookupTable } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { LocalstorageService } from 'apps/elicamps/src/services/localstorage.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentInformationComponent {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() studentRegistration: EventEmitter<any> = new EventEmitter<any>();
  @Output() getBygroup: EventEmitter<any> = new EventEmitter<any>();
  @Input() student!: Student;
  @Input() studentForm!: FormGroup;
  @Input() groupList: any;
  @Input() statusList: any = [];
  public studentRegisterForm!: FormGroup;
  public submitted = false;
  @Input() agentList: any;
  public documentId: any;
  public selectedGroup!: Group;
  public studentId!: number;
  @Input() isEdit = false;
  public loading = false;
  public selectedStudent!: Student;
  @Input() campList: LookupTable[] = [];
  public yearList = [{ value: 2020, name: '2020' }, { value: 2021, name: '2021' }];
  public genderList = [{ value: 1, name: 'Male' }, { value: 2, name: 'Female' }];
  fileData!: File;
  previewUrl: any = null;
  fileUploadProgress!: string;
  uploadedFilePath!: string;
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
  ngOnChanges(change: SimpleChanges) {
    if (change && change['studentForm'] && change['studentForm'].currentValue) {
      this['studentForm'] = change['studentForm'].currentValue;
      this.calculateAge();
    }
  }
  selectValue = (value: any) => {
    if (value) {
      const agentToFind: any = this.agentList.find((agent: any) => agent.id === value);
      if (agentToFind) {
        this.studentForm.controls['country'].setValue(agentToFind.country);
      }
    }
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
    const duration = moment.duration(now.diff(this.studentForm.controls['dob'].value));
    const years = duration.asYears();
    if (years) {
      this.studentForm.controls['age'].setValue(Math.floor(years));
    }
  }

  upload() {

    const model: any = {
      ProfilePic: this.fileData
    };
    this.listService.uploadStudentProfile(model).subscribe((res: any) => {
      if (res) {
        this.documentId = +res;
      }
    });

  }
  displayFn(value: any) {
    return value;
  }
}
