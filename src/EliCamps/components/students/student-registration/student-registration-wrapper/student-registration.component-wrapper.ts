import {
  Campus,
  Group,
  LookupTable,
  Program,
  Student,
  SubProgram,
  TripsMangerModel,
} from "src/EliCamps/EliCamps-Models/Elicamps";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatStepper, MatTabChangeEvent } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { GroupService } from "src/EliCamps/services/group.service";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { DatePipe, Location } from "@angular/common";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { SharedService } from "src/EliCamps/services/shared.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ListService } from "src/EliCamps/services/list.service";
import { Keys, LookupEnum } from "src/EliCamps/common/lookup.enums";
import { LocalstorageService } from "src/EliCamps/services/localstorage.service";
import { PaymentInformationComponent } from "../payment-information/payment-information.component";
import { ToastrService } from "ngx-toastr";
import { StudentInformationComponent } from "../student-information/student-information.component";
import * as moment from "moment";
import { AccomodationComponent } from "../accomodation/accomodation.component";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-student-registration-wrapper",
  templateUrl: "./student-registration-wrapper.component.html",
  styleUrls: ["./student-registration-wrapper.component.scss"],
})
export class StudentRegistrationWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
  public studentId: number;
  public isEdit = false;
  public loading = false;
  public selectedStudent: Student;
  public showStudentInformation = false;
  public studentState: Student;
  public studentForm: FormGroup;
  public groupList = [];
  public chapProgramList: LookupTable[] = [];
  public programList: Program[] = [];
  public subProgramList: SubProgram[] = [];
  public formatList: LookupTable[] = [];
  public campusList: Campus[] = [];
  public mealPlanList: LookupTable[] = [];
  public addinsList: [] = [];
  public homeStayList = [];
  public roomList = [];
  public agentList = [];
  public groupPaymentList = [];
  public campList = [];
  public statusList = [];
  public dateKeys = ['arrivalDate', 'departureDate','programeStartDate', 'programeEndDate']
  @ViewChild('paymentInfo') paymentInf: PaymentInformationComponent;
  @ViewChild('studentInfo') studentInfo: StudentInformationComponent;
  @ViewChild('accom') accom: AccomodationComponent;
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public groupService: GroupService,
    public location: Location,
    public dialog: MatDialog,
    public shared: SharedService,
    public fb: FormBuilder,
    public listService: ListService,
    public storage: LocalstorageService,
    public toastr: ToastrService,
    public datePipe: DatePipe,
    public spinner: NgxSpinnerService
  ) {}
  public selectedTab = 0;
  ngOnInit() {
    this.initializeStudentForm();
    this.initializeDropdowns();
    this.getGroupList();
    this.getParams();
  }
  public initializeStudentForm() {
    const regFee = this.storage.get(Keys.REG_FEE);
    this.studentForm = this.fb.group({
       // Student Information
      id: [0],
      year: [new Date().getFullYear()],
      reg_Ref: [''],
      grpRef: [''],
      groupRef: [''],
      camps: [''],
      gender: [''],
      firstName: [''],
      lastName: [''],
      homeAddress: [''],
      city: [''],
      state: [''],
      country: [''],
      postCode: [''],
      emergencyContact: [''],
      email: [''],
      phone: [''],
      dob: [''],
      age: [''],
      passportNumber: [''],
      agencyID: [''],
      agentId: [''],
      agencyRef: [''],
      groupID: [''],
      active: [true],
      statusId: [],
      // Student Information

       // Flight Information
      arrivalDate: [''],
      terminal: [''],
      flightNumber: [''],
      destinationFrom: [''],
      arrivalTime: [''],
      departureDate: [''],
      departureTerminal: [''],
      departureFlightNumber: [''],
      destinationTo: [''],
      flightDepartureTime: [''],
       // Flight Information

      // Medical Information
      medicalInformation: [''],
      dietaryNeeds: [''],
      allergies: [''],
      medicalNotes: [''],
      medicalConditon: [''],
      // Medical Information

      // Program Information
      programeStartDate: [''],
      programeEndDate: [''],
      campus: [''],
      addinsID: [''],
      formatName: [''],
      agentName: [''],
      programeAddins: [null],
      mealPlan: ['Full Board'],
      programID: [null],
      subProgramID: [null],
      format: [1020],
      chapFamily: ['Student'],
      // Program Information

      // Notes Information
      extraNotes: [''],
      extraNotesHTML: [''],
      // Notes Information

      // Accomodation Information
      status: [''],
      homestayOrResi: [null],
      homestayID: [''],
      roomID: [''],
      roomSearchCampus: [''],
      roomSearchFrom: [''],
      roomSearchTo: [''],
      // Accomodation Information

      // Payment Information
      numberOfNights: [0],
      totalGrossPrice: [null],
      totalAddins: [null],
      paid: [null],
      commision: [null],
      commissionAddins: [null],
      profilePic: [''],
      netPrice: [null],
      balance: [null],
      registrationFee: [Number(regFee)],
       // Payment Information

       // Trips Information
      studentTrips: [''],
      studentTripsID: [''],
       // Trips Information

       // Document Information
      documentPath: [''],
        // Document Information

    });
  }
  ngAfterViewInit(): void {
    this.paymentInf.calculate();
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
    this.route.queryParams.subscribe((params) => {
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
      width: "250px"
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit(true);
      }
    });
  };
  public getSelectedStudent = (studentId: number) => {
    this.loading = true;
    this.groupService.getElicampsStudent(studentId).subscribe(
      (student: Student) => {
        if (student) {
          this.isEdit = true;
          this.loading = false;
          this.selectedStudent = student;
          this.selectedStudent.groupRef= +student.groupRef;
          if (!this.selectedStudent.arrivalDate && this.selectedStudent.programeStartDate) {
            this.selectedStudent.arrivalDate = this.selectedStudent.programeStartDate;
          }
          if (!this.selectedStudent.departureDate && this.selectedStudent.programeEndDate) {
            this.selectedStudent.departureDate = this.selectedStudent.programeEndDate;
          }
          this.initializeStudentFormWithValues(this.selectedStudent);
          this.getStudentPayments(this.selectedStudent.id)
          if (this.selectedStudent.homestayOrResi) {
            this.accom.gethoomeStaylist({value: this.selectedStudent.homestayOrResi})
          }
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  };
  public getStudentPayments = (studentId: number) => {
    this.groupService.getAllPaymentStudentByStudentId(studentId).subscribe(res => {
      this.groupPaymentList = res;
      this.groupPaymentList.forEach(payment => {
        payment.date = this.datePipe.transform(payment.date, 'short');
      });
      if (this.groupPaymentList.length > 0) {
        const paidValues = this.groupPaymentList.map(a => a.amount);
        const paid = paidValues.reduce((a, b) => a + b);
        this.studentForm.controls.paid.setValue(paid);
        this.paymentInf.calculate();
      } else {
        this.studentForm.controls.paid.setValue(0);
        this.paymentInf.calculate();
      }
    });
  }
  public initializeStudentFormWithValues(student: any) {
    const keys = ['arrivalTime', 'flightDepartureTime'];
    student.programeStartDate = student.programeStartDate ? student.programeStartDate : student.arrivalDate;
    student.programeEndDate = student.programeEndDate ? student.programeEndDate : student.departureDate;
    Object.keys(this.studentForm.controls).forEach(key => {
      if (!keys.includes(key) && this.dateKeys.includes(key) && student[key]) {
        this.studentForm.controls[key].setValue(new Date(student[key]));
      } else if (!keys.includes(key) && student[key] !== null && student[key] !== undefined) {
        this.studentForm.controls[key].setValue(student[key]);
      }
    });
    keys.forEach(key => {
      if (student[key]) {
        const dateTime = moment(student[key]);
        this.studentForm.controls[key].setValue(dateTime.toDate());
      }
    });
    this.populateNumberOfNights(this.studentForm.value);
    this.paymentInf.calculate();
  }
  public populateNumberOfNights = (student) => {
    if (student && student.programeStartDate && student.programeEndDate) {
      const date1 = new Date(student.programeStartDate);
      const date2 = new Date(student.programeEndDate);
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (this.studentForm && this.studentForm.controls) {
        this.studentForm.controls.numberOfNights.setValue(numberOfNights);
      }
    }
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
  public getGroupList = () => {
    const params = {
      active: true
    };
    this.groupService.getAllElicampsGroups(params).subscribe((groupList: Group[]) => {
      this.groupList = ((groupList as any).data || []);
    });
  }
  public getBygroupId = (flag: boolean) => {
    const groupId = this.studentForm.controls.groupID.value;
    this.loading = true;
    this.groupService.getElicampsGroup(groupId).subscribe((group: Group) => {
      if (group) {
        group.agencyID = group.agentID;
        group.programID = group.programId;
        group.subProgramID = group.subProgramId;
        delete group.id;
        delete group.totalGrossPrice;
        delete group.paid;
        delete group.balance;
        delete group.netPrice;
        delete group.numberOfNights;
        this.initializeStudentFormWithValues(group)
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
  calcNumOfNights(value) {
    const student = this.studentForm.value;
    this.populateNumberOfNights(student);
  }
  applyDateChangeToField(dateEvent) {
    if (dateEvent.field === 'arrivalDate') {
      this.studentForm.controls.programeStartDate.setValue(dateEvent.value);
    } else if (dateEvent.field === 'departureDate') {
      this.studentForm.controls.programeEndDate.setValue(dateEvent.value);
    } else if (dateEvent.field === 'programeStartDate') {
      this.studentForm.controls.arrivalDate.setValue(dateEvent.value);
    } else if (dateEvent.field === 'programeEndDate') {
      this.studentForm.controls.departureDate.setValue(dateEvent.value);
    }
    this.calcNumOfNights(this.studentForm.value);
  }
  public initializeDropdowns(){
    const params = {
      active: true
    };
    this.listService.getAllCampus(params).subscribe(res => {
      this.campusList = res.data;
    });
    this.listService.getAll(LookupEnum.MEALPLAN).subscribe(res => {
      this.mealPlanList = res;
    });
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe(res => {
      this.statusList = res;
    });
    this.listService.getAll(LookupEnum.FORMAT).subscribe(res => {
      this.formatList = res;
    });
    this.listService.getAll(LookupEnum.CHAPPROGRAM).subscribe(res => {
      this.chapProgramList = res;
    });
    this.listService.getAll(LookupEnum.CAMPS).subscribe(res => {
      this.campList = res;
    });
    this.listService.getAllHomeStay().subscribe(res => {
      this.homeStayList = res.data;
    });

    this.listService.getAllRoomList().subscribe(res => {
      this.roomList = res.data;
    });
    this.listService.getAllAgent({ active: true }).subscribe(res => {
      this.agentList = res.data;
    });
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinsList = res.data;
      const defaultAddins = this.addinsList.filter((addin: any) => addin.isDefault).map((add: any) => add.id);
      if (this.studentForm.controls.programeAddins.value && this.studentForm.controls.programeAddins.value.length > 0) {
        this.studentForm.controls.programeAddins.setValue(this.studentForm.controls.programeAddins.value);
      } else {
        this.studentForm.controls.programeAddins.setValue(defaultAddins);
      }
    });
    this.listService.getAllProgram(params).subscribe(res => {
      this.programList = res.data;
      const defaultProgram = this.programList.find(program => program.isDefault);
      if (this.studentForm.controls.programID.value) {
        this.studentForm.controls.programID.setValue(this.studentForm.controls.programID.value);
        this.getSubProgram(this.studentForm.controls.programID.value);
      } else {
        this.studentForm.controls.programID.setValue(defaultProgram.id);
        this.getSubProgram({ value: defaultProgram.id });
      }
    });
  }
  public getSubProgram = (program) => {
    this.listService.getSubProgramByProgramId(program.value).subscribe(res => {
      this.subProgramList = res.data;
    });
  }
  Cancel_Click() {
    this.router.navigate(['/students']);
  }
  public onSubmit(isClose: boolean) {
    const data = this.studentForm.value;
    data.arrivalTime = data.arrivalTime ? moment(data.arrivalTime).format('YYYY-MM-DD HH:mm:ss') : '';
    data.flightDepartureTime =
      data.flightDepartureTime ? moment(data.flightDepartureTime).format('YYYY-MM-DD HH:mm:ss') : '';
    data.programeStartDate = data.programeStartDate ? moment(data.programeStartDate).format('MM/DD/YYYY') : '';
    data.programeEndDate = data.programeEndDate ? moment(data.programeEndDate).format('MM/DD/YYYY') : '';
    data.arrivalDate = data.arrivalDate ? moment(data.arrivalDate).format('MM/DD/YYYY') : '';
    data.departureDate = data.departureDate ? moment(data.departureDate).format('MM/DD/YYYY') : '';
    if (this.studentForm.valid) {
      this.spinner.show();
      if (this.isEdit === false) {
        const model = {
          year: data.year,
          reg_Ref: data.reg_Ref,
          grpRef: data.grpRef,
          groupRef: data.groupRef,
          camps: data.camps,
          gender: data.gender,
          firstName: data.firstName,
          lastName: data.lastName,
          homeAddress: data.homeAddress,
          city: data.city,
          state: data.state,
          country: data.country,
          postCode: data.postCode,
          emergencyContact: data.emergencyContact,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          age: data.age,
          passportNumber: data.passportNumber,
          agencyID: data.agencyID,
          agentId: data.agentId,
          agencyRef: data.agencyRef,
          active: data.active,
          groupID: data.groupID,
          statusId: data.statusId,
          // Student Information

           // Flight Information
          arrivalDate: data.arrivalDate,
          terminal: data.terminal,
          flightNumber: data.flightNumber,
          destinationFrom: data.destinationFrom,
          arrivalTime: data.arrivalTime,
          departureDate: data.departureDate,
          departureTerminal: data.departureTerminal,
          departureFlightNumber: data.departureFlightNumber,
          destinationTo: data.destinationTo,
          flightDepartureTime: data.flightDepartureTime,
           // Flight Information

          // Medical Information
          medicalInformation: data.medicalInformation,
          dietaryNeeds: data.dietaryNeeds,
          allergies: data.allergies,
          medicalNotes: data.medicalNotes,
          // Medical Information

          // Program Information
          programeStartDate: data.programeStartDate,
          programeEndDate: data.programeEndDate,
          campus: data.campus,
          addinsID: data.addinsID,
          formatName: data.formatName,
          agentName: data.agentName,
          programeAddins: data.programeAddins,
          mealPlan: data.mealPlan,
          programID: data.programID,
          subProgramID: data.subProgramID,
          format: data.format,
          chapFamily: data.chapFamily,
        }
        this.listService.addStudentInfo(model).subscribe(res => {
          if (!isClose) {
            const studentId = res;
            let apiModel = this.clean(data);
            let updateMode = {
              ...apiModel,
              id: studentId
            }
              this.listService.updateStudentInfo(updateMode).subscribe(res => {
                this.router.navigate(['registerStudent'], {
                  queryParams: {
                    studentId: btoa(studentId.toString())
                  }
                });
                this.spinner.hide();
              });
              if (this.selectedTab < 9) {
                this.stepper.next();
              }
          } else {
            this.router.navigate(['/students'])
          }
        });
      }
      if (this.isEdit === true) {
        let apiModel = this.clean(data);
        this.listService.updateStudentInfo(apiModel).subscribe(res => {
          if (isClose) {
            this.router.navigate(['/students'])
          } else {
            this.toastr.success('Student Information Section Updated', 'Success');
          }
          this.spinner.hide();
        });
      }
    }
  }
   clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }
}
