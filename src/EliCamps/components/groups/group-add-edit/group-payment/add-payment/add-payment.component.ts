import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupTable, ProgrameAddins, PaymentGroup } from '../../../../../EliCamps-Models/Elicamps';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListService } from '../../../../../services/list.service';
import { GroupService } from '../../../../../services/group.service';
import { GroupProgrameComponent } from '../../group-programe/group-programe.component';
import { LookupEnum } from '../../../../../common/lookup.enums';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
 public defaultColDef;


  public paymentFrom: FormGroup;
  public submitted = false;
  private gridApi: any;
  public isEdit = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private listService: ListService,
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
      refNumber: [null],
      groupId: [this.data.id],
      date: [null],
      amount: [null],
      remarks: [''],
      active: [true],
    });
  }
  public checkIfIsEdit = () => {
    if (this.data.groupPaymentId) {
      this.paymentFrom.controls.id.setValue(this.data.groupPaymentId);
      this.getGroupPayment(this.data.groupPaymentId);
    }
  }
  public getGroupPayment = (paymentGroupId: number) => {
    this.groupService.getPaymentGroup(paymentGroupId).subscribe(res => {
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
    if (this.paymentFrom.valid) {
      const model = {
        ...this.paymentFrom.value
      };
      model.date = this.paymentFrom.controls.date.value ? moment(this.paymentFrom.controls.date.value).format('MM/DD/YYYY') : '';
      this.spinner.show();
      if (this.isEdit) {
        model.groupID = this.data.id;
        this.groupService.updatePaymentGroup(model).subscribe(res => {
          if (res) {
            this.spinner.hide();
            this.isEdit = false;
            this.dialogRef.close(true);
          }
        }, error => { this.spinner.hide(); });
      } else {
        this.groupService.addPaymentGroup(model).subscribe(res => {
          if (res) {
            this.spinner.hide();
            this.dialogRef.close(true);
          }
        }, error => { this.spinner.hide(); });
      }
    }
  }
}
