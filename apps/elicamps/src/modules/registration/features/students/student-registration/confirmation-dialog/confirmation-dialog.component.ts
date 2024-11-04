/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { SharedService } from 'apps/elicamps/src/services/shared.service';
import * as moment from 'moment';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  public isEdit = false;
  public studentId = '';
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public groupService: ListService,
    public location: Location,
    public route: ActivatedRoute,
    public shared: SharedService,
    public router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      if (res['studentId']) {
        this.studentId = atob(res['studentId']);
        this.isEdit = true;
      }
    });
  }
  public saveAndClose = () => {
    this.dialogRef.close(true)
  }
  public onNoClick = () => {
    this.router.navigate(['students']);
    this.dialogRef.close();
  }
}
