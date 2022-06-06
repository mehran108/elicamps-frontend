import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupTable, ProgrameAddins, PaymentGroup } from '../../../../../EliCamps-Models/Elicamps';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListService } from '../../../../../services/list.service';
import { GroupService } from '../../../../../services/group.service';
import { LookupEnum } from '../../../../../common/lookup.enums';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentInformationComponent } from '../payment-information.component';
import { GroupProgrameComponent } from 'src/EliCamps/components/groups/group-add-edit/group-programe/group-programe.component';
import * as moment from 'moment';
@Component({
  selector: 'app-student-payment',
  templateUrl: './student-payment.component.html',
  styleUrls: ['./student-payment.component.css']
})
export class StudentPaymentComponent implements OnInit {


  public paymentFrom: FormGroup;
  public submitted = false;
  public isEdit = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialogRef: MatDialogRef<GroupProgrameComponent>,
    public spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.initializeForm();
    this.checkIfIsEdit();
  }
  initializeForm() {
    this.paymentFrom = this.formBuilder.group({
      id: [0],
      studentRegID: [this.data.id, Validators.required],
      date: [Validators.required],
      amount: [null, Validators.required],
      remarks: [''],
      active: [true, Validators.required],
    });
  }
  public checkIfIsEdit = () => {
    if (this.data.paymentStudentID) {
      this.getStudentPayment(this.data.paymentStudentID);
    }
  }
  public getStudentPayment = (studentPaymentId: number) => {
    this.groupService.getPaymentStudent(studentPaymentId).subscribe(res => {
      if (res) {
        this.isEdit = true;
        this.populateValues(res);
      }
    });
  }
  public populateValues = (paymentGroup: PaymentGroup) => {
    Object.keys(this.paymentFrom.controls).forEach(key => {
      if (paymentGroup[key] !== null) {
        this.paymentFrom.controls[key].setValue(paymentGroup[key]);
      }
    });
  }
  onSubmit = () => {
    this.submitted = true;
    const model = {
      ...this.paymentFrom.value
    };
    model.date = this.paymentFrom.controls.date.value ? moment(this.paymentFrom.controls.date.value).format('MM/DD/YYYY') : '';
    // this.spinner.show();
    if (this.isEdit) {
      this.groupService.updatePaymentStudent(model).subscribe(res => {
        if (res) {
          this.isEdit = false;
          this.spinner.hide();
          this.dialogRef.close(true);
        }
        this.dialogRef.close(true);
      }, error => {
        this.spinner.hide();
      });
    } else {
      this.groupService.addPaymentStudent(model).subscribe(res => {
        if (res) {
          this.spinner.hide();
          this.dialogRef.close(true);
        }
        this.dialogRef.close(true);
      }, error => {
        this.spinner.hide();
      });
    }
  }
}
