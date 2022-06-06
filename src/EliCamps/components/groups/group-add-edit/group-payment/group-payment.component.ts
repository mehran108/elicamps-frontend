import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupTable, ProgrameAddins, Group } from '../../../../EliCamps-Models/Elicamps';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ListService } from '../../../../services/list.service';
import { GroupService } from '../../../../services/group.service';
import { GroupProgrameComponent } from '../group-programe/group-programe.component';
import { GROUP_PAYMENT_COL_DEFS, GROUP_LEADER_PAYMENT_COL_DEFS } from '../../../../common/elicamps-column-definitions';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { DatePipe, Location } from '@angular/common';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationDialogComponent } from 'src/EliCamps/components/confirmation-dialog/delete-confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonRendererComponent } from 'src/EliCamps/ag-grid/renderers/button-renderer.component';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-group-payment',
  templateUrl: './group-payment.component.html',
  styleUrls: ['./group-payment.component.css']
})
export class GroupPaymentComponent implements OnInit {
 public defaultColDef;

  public paymentForm: FormGroup;
  public submitted = false;
  public groupPaymentList = [];
  public groupPaymentLeaderList = [];
  private gridApi: any;
  private selectedGroup: Group;
  public columnDefs = GROUP_PAYMENT_COL_DEFS;
  public columnDefsLeader = GROUP_LEADER_PAYMENT_COL_DEFS;
  public gridOptions: any;
  public modules = AllModules;
  public groupId = 0;
  public isEdit = false;
  public isLeaderEdit = false;
  public invoiceTypeList = [{ value: 'Gross', name: 'Gross' }, { value: 'Net', name: 'Net' }];
  constructor(
    private formBuilder: FormBuilder,
    public groupService: GroupService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public route: ActivatedRoute,
    public location: Location,
    public toastr: ToastrService,
    public confirmationDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    public spinner: NgxSpinnerService) {
        this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
        buttonRenderer: ButtonRendererComponent
      }
    };
  }

  ngOnInit() {
    const buttonRenderer = {
      headerName: '',
      field: 'cancel',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openRemovePaymentDialog.bind(this),
      },
      width: 80
    };
    const leaderButtonRenderer = {
      headerName: '',
      field: 'cancel',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openRemoveLeaderPaymentDialog.bind(this),
      },
      width: 80
    };
    this.columnDefs = [];
    this.columnDefs.push(...GROUP_PAYMENT_COL_DEFS, buttonRenderer as any);
    this.columnDefsLeader = [];
    this.columnDefsLeader.push(...GROUP_LEADER_PAYMENT_COL_DEFS, leaderButtonRenderer as any);
    this.initializeForm();
    this.getParams();
  }
  openRemoveLeaderPaymentDialog(group: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { headerName: `${group.rowData.refNumber}` }
    });

    this.confirmationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGroupLeaderPayment(group.rowData);
      }
    });
  }
  openRemovePaymentDialog(group: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { headerName: `${group.rowData.refNumber}` }
    });

    this.confirmationDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGroupPayment(group.rowData);
      }
    });
  }
  deleteGroupPayment(rowData: any) {
    const row = {
      id: rowData.id,
      active: false,
    };
    this.spinner.show();
    this.groupService.activatePaymentGroup(row).subscribe(res => {
      this.spinner.hide();
      this.getGroupPayments(this.groupId);
    }, error => {
      this.spinner.hide();
    });
  }
  deleteGroupLeaderPayment(rowData: any) {
    const row = {
      id: rowData.id,
      active: false,
    };
    this.spinner.show();
    this.groupService.activatePaymentGroupLeader(row).subscribe(res => {
      this.spinner.hide();
      this.getGroupPayments(this.groupId);
    }, error => {
      this.spinner.hide();
    });
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.groupId) {
        this.groupId = Number(atob(params.groupId));
        if (this.groupId) {
          this.isEdit = true;
          this.getGroupPayments(this.groupId);
          this.getSelectedGroup(this.groupId);
          this.populateNumberOfNights();
        }
      }
    });
  }
  public getSelectedGroup = (groupId: number) => {
    this.groupService.getElicampsGroup(groupId).subscribe((group: Group) => {
      this.selectedGroup = group;
      this.initializeFormWithValues();
    }, error => {
    });
  }
  initializeForm() {
    this.paymentForm = this.formBuilder.group({
      numberOfNights: [0],
      totalGrossPrice: [0],
      paid: [0],
      commision: [0],
      netPrice: [0],
      balance: [0],
      numOfStudents: [0],
      numOfGrpLeaders: [0],
      perStudent: [0],
      perGrpLeader: [0],
      refNumber: [],
      amount: [],
      leaderPaymentId: [0],
      active: [true],
      invoiceType: ['']
    });
    this.calculate();
  }
  initializeFormWithValues() {
    this.paymentForm = this.formBuilder.group({
      numberOfNights: [this.selectedGroup.numberOfNights, Validators.required],
      totalGrossPrice: [this.selectedGroup.totalGrossPrice, Validators.required],
      paid: [this.selectedGroup.paid, Validators.required],
      commision: [this.selectedGroup.commision, Validators.required],
      netPrice: [this.selectedGroup.netPrice, Validators.required],
      balance: [this.selectedGroup.balance, Validators.required],
      numOfStudents: [this.selectedGroup.numOfStudents, Validators.required],
      numOfGrpLeaders: [this.selectedGroup.numOfGrpLeaders, Validators.required],
      perStudent: [this.selectedGroup.perStudent, Validators.required],
      perGrpLeader: [this.selectedGroup.perGrpLeader, Validators.required],
      refNumber: [],
      invoiceType: [''],
      amount: [],
      leaderPaymentId: [0],
      active: [true]
    });
    this.populateNumberOfNights();
    this.calculate();
  }
  public populateNumberOfNights = () => {
    if (this.selectedGroup && this.selectedGroup.departureDate && this.selectedGroup.arrivalDate) {
      const date1 = new Date(this.selectedGroup.arrivalDate);
      const date2 = new Date(this.selectedGroup.departureDate);
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (this.paymentForm && this.paymentForm.controls) {
        this.paymentForm.controls.numberOfNights.setValue(numberOfNights);
      }
    }
  }
  public getGroupPayments = (groupId: number) => {
    this.groupService.getAllPaymentGroupByGroupId(groupId).subscribe(res => {
      this.groupPaymentList = res;
      this.groupPaymentList.forEach(payment => {
        payment.date = this.datePipe.transform(payment.date, 'short');
      });
    });
    this.groupService.getAllPaymentGroupLeaderByGroupId(groupId).subscribe(res => {
      this.groupPaymentLeaderList = res;
      this.groupPaymentLeaderList.forEach(payment => {
        payment.date = this.datePipe.transform(payment.date, 'short');
      });
    });
  }
  calculate = () => {
    const numberOfStudentsIntoPrice = +this.paymentForm.controls.numOfStudents.value * +this.paymentForm.controls.perStudent.value;
    let numberOfLeadersIntoPrice = 0;
    this.groupPaymentLeaderList.forEach(res => {
      if (res.active) {
        numberOfLeadersIntoPrice += res.amount;
      }
    });
    const totalNetPrice = numberOfStudentsIntoPrice + numberOfLeadersIntoPrice;
    this.paymentForm.controls.netPrice.setValue(totalNetPrice);
    this.paymentForm.controls.totalGrossPrice.setValue(totalNetPrice);
    if (this.paymentForm.controls.commision.value) {
      const commisionToSubtract = ((this.paymentForm.controls.commision.value / 100) * this.paymentForm.controls.totalGrossPrice.value);
      if (commisionToSubtract) {
        const calculatedCommission = this.paymentForm.controls.totalGrossPrice.value - commisionToSubtract;
        if (calculatedCommission) {
          this.paymentForm.controls.netPrice.setValue(calculatedCommission);
        }
      }
    }
    const balance = this.paymentForm.controls.netPrice.value - this.paymentForm.controls.paid.value;
    this.paymentForm.controls.balance.setValue(balance);
  }
  onSubmit = () => {
    this.submitted = true;
    if (this.paymentForm.valid) {
      const model = {
        ...this.selectedGroup,
        ...this.paymentForm.value
      };
      this.groupService.updateGroupPayment(model).subscribe(res => {
        if (res) {
          this.toastr.success('Success', 'Group Payment Updated Successfully');
        }
      });
    }
  }
  public onSubmitPayment = () => {

  }
  openPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      data: {
        ...this.selectedGroup,
        groupPaymentId: id
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getGroupPayments(this.selectedGroup.id);
        this.getSelectedGroup(this.selectedGroup.id);
      }
    });
  }
  onCellClicked = ($event) => {
    this.openPaymentDialog($event.data.id);
  }
  onLeaderCellClicked = ($event) => {
    this.isLeaderEdit = true;
    this.paymentForm.controls.refNumber.setValue($event.data.refNumber);
    this.paymentForm.controls.amount.setValue($event.data.amount);
    this.paymentForm.controls.active.setValue($event.data.active);
    this.paymentForm.controls.leaderPaymentId.setValue($event.data.id);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  public generateInvoice = () => {
    window.open
      // tslint:disable-next-line: max-line-length
      (`${environment.appURL}/#/group-invoice?groupId=${btoa(this.selectedGroup.id.toString())}&type=${this.paymentForm.controls.invoiceType.value}&invoiceType=${this.paymentForm.controls.invoiceType.value}&groupInvoice=true`);
  }
  public submitLeaderPayment = () => {
    if (this.paymentForm.controls.refNumber.value && this.paymentForm.controls.amount.value) {
      const model = {
        refNumber: this.paymentForm.controls.refNumber.value,
        amount: this.paymentForm.controls.amount.value,
        active: this.paymentForm.controls.active.value,
        groupID: this.groupId,
        date: new Date().toLocaleString(),
        id: 0
      };
      if (this.isLeaderEdit) {
        model.id = this.paymentForm.controls.leaderPaymentId.value;
        this.groupService.updatePaymentGroupLeader(model).subscribe(res => {
          this.resetValues();
          this.getGroupPayments(this.groupId);
        });
      } else {
        this.groupService.addPaymentGroupLeader(model).subscribe(res => {
          this.resetValues();
          this.getGroupPayments(this.groupId);
        });
      }

    }
  }
  public resetValues() {
    this.paymentForm.controls.refNumber.setValue('');
    this.paymentForm.controls.amount.setValue(null);
    this.paymentForm.controls.leaderPaymentId.setValue(null);
    this.isLeaderEdit = false;
  }
}
