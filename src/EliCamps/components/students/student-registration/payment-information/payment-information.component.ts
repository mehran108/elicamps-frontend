import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ListService } from "src/EliCamps/services/list.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location, DatePipe } from "@angular/common";
import { Agent, Group, Student } from "src/EliCamps/EliCamps-Models/Elicamps";
import { SharedService } from "src/EliCamps/services/shared.service";
import { environment } from "src/environments/environment";
import { GroupService } from "src/EliCamps/services/group.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import { STUDENT_PAYMENT_COL_DEFS } from "src/EliCamps/common/elicamps-column-definitions";
import { StudentPaymentComponent } from "./student-payment/student-payment.component";
import { MatDialog, MatDialogRef } from "@angular/material";
import * as moment from "moment";
import { DeleteConfirmationDialogComponent } from "src/EliCamps/components/confirmation-dialog/delete-confirmation-dialog.component";
import { ButtonRendererComponent } from "src/EliCamps/ag-grid/renderers/button-renderer.component";
import { LocalstorageService } from "src/EliCamps/services/localstorage.service";
import { Keys } from "src/EliCamps/common/lookup.enums";
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: "app-payment-information",
  templateUrl: "./payment-information.component.html",
  styleUrls: ["./payment-information.component.css"],
})
export class PaymentInformationComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStudentRegistration: EventEmitter<any> = new EventEmitter<any>();
  public paymentinfoform: FormGroup;
  public submitted = false;
  @Input() agentList: Agent[] = [];
  @Input() student: Student;
  @Output() studentPayment: EventEmitter<any> = new EventEmitter();
  @Input() isEdit = false;
  @Input() groupPaymentList = [];
  @Input() homeStayList = [];
  @Input() roomsList = [];
  @Input() studentForm: FormGroup;
  public groupReuestModel: Group;
  public studentId: number;
  public selectedAgent: Agent;
  public loading = false;
  private gridApi: any;
  public columnDefs = STUDENT_PAYMENT_COL_DEFS;
  public gridOptions: any;
  public modules = AllModules;
  public templateList = [];
  public defaultColDef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public shared: SharedService,
    public studentService: GroupService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public confirmationDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    public storage: LocalstorageService
  ) {
        this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
        buttonRenderer: ButtonRendererComponent,
      },
    };
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.paymentinfoform;
  }
  ngOnInit() {
    const buttonRenderer = {
      headerName: "",
      field: "cancel",
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.openRemovePaymentDialog.bind(this),
      },
      width: 80,
    };
    this.columnDefs = [];
    this.columnDefs.push(...STUDENT_PAYMENT_COL_DEFS, buttonRenderer as any);
    this.initializeForm();
    this.f.valueChanges.subscribe((res) => {
      this.templateList = [
        {
          name: "Default",
          subject: 'Registration Confirmation',
          value: `Thank you for the email and registration. Attached please find documents for {{StudentName}}. Kindly review and let us know if everything is ok.`,
        },
        {
          name: "Deposit",
          subject: 'Deposit Confirmation',
          value: `Thank you for making the deposit for {{StudentName}}. Attached please find the updated documents reflecting the payment. Kindly review and let us know if everything is ok.`,
        },
        {
          name: "Payment",
          subject: 'Payment Confirmation',
          value: `Thank you for making the payment for {{StudentName}}. Attached please find the updated documents reflecting this payment. Kindly review and let us know if everything is ok.`,
        },
        {
          name: "Airport",
          subject: 'Airport Service',
          value: `Thank you for sending us the accurate flight information for {{StudentName}} Attached please find the confirmation of the airport service based on the information received. Kindly review and let us know if everything is ok.`,
        },
      ];
    });
  }
  openRemovePaymentDialog(group: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        width: "250px",
        data: { headerName: `${group.rowData.amount}` },
      }
    );
    this.confirmationDialogRef.afterClosed().subscribe((result) => {
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
    this.listService.activatePaymentStudent(row).subscribe(
      (res) => {
        this.spinner.hide();
        this.studentPayment.emit(this.studentForm.controls.id.value);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  ngOnChanges(change: SimpleChanges) {}
  public getStudentPayments = (studentId: number) => {
    this.studentService
      .getAllPaymentStudentByStudentId(studentId)
      .subscribe((res) => {
        this.groupPaymentList = res;
        this.groupPaymentList.forEach((payment) => {
          payment.date = this.datePipe.transform(payment.date, "short");
        });
      });
  };
  public getSelectedAgent = (id: number) => {
    this.listService.getAgent(id).subscribe((res) => {
      if (res) {
        this.selectedAgent = res;
        this.populateForm(this.selectedAgent);
      }
    });
  };
  public populateForm = (agent: Agent) => {
    Object.keys(this.f.controls).forEach((key) => {
      if (key) {
        if (agent[key]) {
          this.f.controls[key].setValue(agent[key]);
        }
      }
    });
  };
  initializeForm() {
    this.paymentinfoform = this.formBuilder.group({
      studentEmail: [],
      files: [],
      isAgentInvoice: [false],
      isStudentInvoice: [false],
      isLoaInvoice: [false],
      isLoaInvoiceWithNoPrice: [false],
      isStudentInvitation: [false],
      isStudentCertificate: [false],
      isAirportInvoice: [false],
      isLoaGroupInvoice: [false],
      active: [true],
      emailType: [null],
      emailBody: [""],
    });
  }
  public navigateByURL = (url: string, priceSection: boolean) => {
    // window.open(
    //   `${environment.appURL}/#/registerStudent/${url}?studentId=${btoa(this.studentId.toString())}&section=${priceSection}`, '_blank');
    let address = this.getAddress();
    const model = {
      isAgentInvoice: url === "agent-invoice" ? true : false,
      isStudentInvoice: url === "student-Loa" ? true : false,
      isLoaInvoice: url === "loa-invoice-with-price" ? true : false,
      isLoaInvoiceWithNoPrice: url === "loa-invoice-no-price" ? true : false,
      isStudentInvitation: url === "student-invitation" ? true : false,
      isStudentCertificate: url === "student-certificate" ? true : false,
      isAirportInvoice: url === "student-Airport-Invoice" ? true : false,
      isLoaGroupInvoice: url === "loa-group-invoice" ? true : false,
      studentEmail: "",
      registrationFee: this.studentForm.controls.registrationFee.value,
      studentId: this.studentForm.controls.id.value,
      address: address,
    };
    this.spinner.show();
    this.studentService.documentGetByStudentId(model).subscribe(
      (res: any) => {
        res.name = "Invoice.pdf";
        this.spinner.hide();
        const link = window.URL.createObjectURL(res);
        window.open(link, "_blank");
      },
      (error) => {
        this.spinner.hide();
        // window.open(error.error.text as any, '_blank');
      }
    );
  };
  public getAddress() {
    let address = "";
    if (this.studentForm.controls.homestayOrResi.value == "1") {
      if (this.studentForm.controls.homestayID.value) {
        const homeStay = this.homeStayList.find(
          (row) => row.homeId === this.studentForm.controls.homestayID.value
        );
        if (homeStay) {
          address = homeStay.address;
        }
      }
    } else if (this.studentForm.controls.homestayOrResi.value == "2") {
      if (this.studentForm.controls.roomID.value) {
        const room = this.roomsList.find(
          (row) => row.id === this.studentForm.controls.roomID.value
        );
        address = `${room.roomID}, ${room.building}, ${room.campus}`;
      }
    }
    return address;
  }
  public getEmailBody(selectedTemplate) {
    const studentName = `${this.studentForm.value.firstName} ${this.studentForm.value.lastName}`;
    let body = "";
    if (selectedTemplate) {
      body = selectedTemplate.value;
    }
    body = body.replace('{{StudentName}}', studentName)
    return body;
  }
  public sendEmail = () => {
    let address = this.getAddress();
    if (this.f.controls.studentEmail.value && this.f.controls.emailBody.value) {
      const selectedTemplate = this.templateList.find(row => row.value === this.f.controls.emailBody.value)
      const model = {
        studentId: this.studentForm.controls.id.value,
        ...this.f.value,
        registrationFee: this.studentForm.controls.registrationFee.value,
        address: address,
        subject: selectedTemplate ? selectedTemplate.subject: '',
        emailBody: "",
      };
      model.emailBody = this.getEmailBody(selectedTemplate);
      this.spinner.show();
      this.studentService.sendEmail(model).subscribe(
        (res) => {
          if (res) {
            this.toastr.success(
              `An email has sent at ${this.f.get("studentEmail").value}.`,
              "Success"
            );
            this.spinner.hide();
            this.clearEmail();
          } else {
            this.toastr.error(
              `Something went wrong email not sent Please check if email is valid and try again`,
              "Error"
            );
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  };
  public clearEmail = () => {
    if (this.f.controls.isAgentInvoice.value) {
      this.f.controls.isAgentInvoice.setValue(false);
    }
    if (this.f.controls.isStudentInvoice.value) {
      this.f.controls.isStudentInvoice.setValue(false);
    }
    if (this.f.controls.isLoaInvoice.value) {
      this.f.controls.isLoaInvoice.setValue(false);
    }
    if (this.f.controls.isLoaInvoiceWithNoPrice.value) {
      this.f.controls.isLoaInvoiceWithNoPrice.setValue(false);
    }
    if (this.f.controls.isStudentInvitation.value) {
      this.f.controls.isStudentInvitation.setValue(false);
    }
    if (this.f.controls.isStudentCertificate.value) {
      this.f.controls.isStudentCertificate.setValue(false);
    }
    if (this.f.controls.isAirportInvoice.value) {
      this.f.controls.isAirportInvoice.setValue(false);
    }
    if (this.f.controls.isLoaGroupInvoice.value) {
      this.f.controls.isLoaGroupInvoice.setValue(false);
    }
    this.f.controls.studentEmail.setValue(null);
  };
  calculate = () => {
    let totalGross = this.studentForm.controls.totalGrossPrice.value;
    if (totalGross && !this.studentForm.controls.netPrice.value) {
      this.studentForm.controls.netPrice.setValue(totalGross);
      this.studentForm.controls.balance.setValue(totalGross);
    }
    if (
      this.studentForm.controls.totalAddins.value &&
      !this.studentForm.controls.commision.value
    ) {
      totalGross = totalGross + this.studentForm.controls.totalAddins.value;
      this.studentForm.controls.netPrice.setValue(totalGross);
    }
    const commisionToSubtract =
      (this.studentForm.controls.commision.value / 100) * totalGross;
    if (commisionToSubtract > -1) {
      let calculatedCommission = totalGross - commisionToSubtract;
      calculatedCommission =
        calculatedCommission + this.studentForm.controls.totalAddins.value;
      if (calculatedCommission) {
        this.studentForm.controls.netPrice.setValue(calculatedCommission);
      }
    }
    if (this.studentForm.controls.commissionAddins.value) {
      const setTotalNetValue =
        this.studentForm.controls.netPrice.value -
        this.studentForm.controls.commissionAddins.value;
      this.studentForm.controls.netPrice.setValue(setTotalNetValue);
    }
    if (this.studentForm.controls.netPrice.value) {
      const total =
        this.studentForm.controls.netPrice.value +
        this.studentForm.controls.registrationFee.value;
      const cummulativeValue = total - this.studentForm.controls.paid.value;
      this.studentForm.controls.balance.setValue(Math.round(cummulativeValue));
    } else {
      const balance =
        this.studentForm.controls.registrationFee.value -
        this.studentForm.controls.paid.value;
      this.studentForm.controls.balance.setValue(balance);
    }
  };
  onCellClicked = ($event) => {
    this.openPaymentDialog($event.data.id);
  };
  openPaymentDialog(id?: number): void {
    const dialogRef = this.dialog.open(StudentPaymentComponent, {
      data: {
        ...this.studentForm.value,
        paymentStudentID: id,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.studentPayment.emit(this.studentForm.controls.id.value);
      }
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }
}
