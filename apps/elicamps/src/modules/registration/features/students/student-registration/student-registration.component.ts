/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { Student, TripsMangerModel } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent implements OnInit, OnDestroy {
  public studentId!: number;
  public isEdit = false;
  public loading = false;
  public selectedStudent!: any;
  public showStudentInformation = false;
  public studentState!: Student;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public groupService: GroupService,
    public location: Location,
    public dialog: MatDialog,
    public shared: SharedService) { }
  public selectedTab = 0;
  ngOnInit() {
    this.getParams();
  }
  public onTabChange(index: any, stepper: any): void {
    this.selectedTab = index;
    if (stepper) {
      stepper.next();
    }
    this.getSelectedStudent(this.studentId);
  }
  onLinkClick(event: StepperSelectionEvent) {
    this.selectedTab = event.selectedIndex;
    this.showStudentInformation = true;
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params['studentId']) {
        this.studentId = Number(atob(params['studentId']));
        if (this.studentId) {
          this.isEdit = true;
          this.getSelectedStudent(this.studentId);
        }
      }
    });
  }
  public backNavigation = () => {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { ...this.shared.getCompleteState(), ...this.shared.getStudentInfoState() }
    });
  }
  public getSelectedStudent = (studentId: number) => {
    this.loading = true;
    this.groupService.getElicampsStudent(studentId).subscribe((student: any) => {
      if (student) {
        this.loading = false;
        this.selectedStudent = student;
        const groupModel: TripsMangerModel = {
          id: student.id,
          grpRef: student.refNumber,
          groupTrips: student.studentTrips
        };
        this.groupService.setTripsMangerState(groupModel);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
  ngOnDestroy(): void {
    this.shared.setCompleteStateToNull();
  }
  base64ToArrayBuffer(base64: any) {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
}
