import { Student, TripsMangerModel } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/EliCamps/services/group.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SharedService } from 'src/EliCamps/services/shared.service';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.scss']
})
export class StudentRegistrationComponent implements OnInit, OnDestroy {
  public studentId: number;
  public isEdit = false;
  public loading = false;
  public selectedStudent: Student;
  public showStudentInformation = false;
  public studentState: Student;
   public defaultColDef;
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
  public onTabChange(index: any, stepper): void {
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
      if (params && params.studentId) {
        this.studentId = Number(atob(params.studentId));
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

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  public getSelectedStudent = (studentId: number) => {
    this.loading = true;
    this.groupService.getElicampsStudent(studentId).subscribe((student: Student) => {
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
  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
}
