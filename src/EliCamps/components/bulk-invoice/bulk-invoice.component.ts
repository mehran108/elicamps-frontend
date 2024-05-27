import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, throwError } from 'rxjs';
import { Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { GroupService } from 'src/EliCamps/services/group.service';
import { ListService } from 'src/EliCamps/services/list.service';

@Component({
  selector: 'app-bulk-invoice',
  templateUrl: './bulk-invoice.component.html',
  styleUrls: ['./bulk-invoice.component.css']
})
export class BulkInvoiceComponent implements OnInit {
  public isStudentInvoice = false;
  public isAgentInvoice = false;
  public isLoaInvoiceWithNoPrice = false;
  public isLoaInvoice = false;
  public isLoaGroupInvoice = false;
  public isStudentInvitation = false;
  public isAirportInvoice = false;
  public isStudentCertificate = false;
  public agentList: Array<any> = new Array();
  public studentList: Array<any> = new Array();
  public selectedStudents: Array<any> = new Array();
  public homeStayList: Array<any> = new Array();
  public campusList: Array<any> = new Array();
  public allStudentList: Array<any> = new Array();
  public studentEmail = '';
  public templateList = [
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
  public emailBody = '';
  public emailType = 1;
  public selectedAgent: any;
  public selectedTemplate: any;
  constructor(public groupService: GroupService, public listService: ListService, public toast: ToastrService) { }

  async ngOnInit() {
    await this.getLists();
    this.getStudentList();
    this.getAgentList();
  }
  public async getLists() {
    const homestayList = await this.listService.getAllHomeStay().toPromise().catch((error) => throwError(error));
    if (homestayList) {
      this.homeStayList = homestayList.data;
    }
    const campusList = await this.listService.getAllCampus({}).toPromise().catch((error) => throwError(error));
    if (campusList) {
      this.campusList = campusList.data;
    }
  }
  public getStudentList = () => {
    const params = {
      active: true,
    };
    this.groupService
      .getAllElicampsStudents(params)
      .subscribe((studentList: Student[]) => {
        this.studentList = ((studentList as any).data || []).sort((a, b) =>
          a.active > b.active ? -1 : 0
        );
        this.allStudentList = [...this.studentList];
      });
  };
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getAllAgent({}).subscribe(res => {
      this.agentList = (res as any).data;
      this.agentList = this.agentList.filter(row => row.active && row.email);
    });
  }
  public sendEmail = () => {
    if (this.studentEmail && this.emailBody) {
      const selectedTemplate = this.templateList.find(row => row.value === this.emailBody);
      const tasks = this.createEmailTasks(selectedTemplate);
      forkJoin(tasks).subscribe(res => {
        this.toast.success('Email', 'Document(s) of selected students sent successfully.');
      })
    }
  };
  public createEmailTasks(selectedTemplate: any) {
    const tasks = [];
    this.selectedStudents.forEach(student => {
      let address = this.getAddress(student);
      const model = {
        studentId: student.id,
        registrationFee: student.registrationFee,
        address: address,
        subject: selectedTemplate ? selectedTemplate.subject : '',
        emailBody: "",
        isStudentInvoice: this.isStudentInvoice,
        isAgentInvoice: this.isAgentInvoice,
        isLoaInvoiceWithNoPrice: this.isLoaInvoiceWithNoPrice,
        isLoaInvoice: this.isLoaInvoice,
        isLoaGroupInvoice: this.isLoaGroupInvoice,
        isStudentInvitation: this.isStudentInvitation,
        isAirportInvoice: this.isAirportInvoice,
        isStudentCertificate: this.isStudentCertificate,
        studentEmail: this.studentEmail
      };
      model.emailBody = this.getEmailBody(selectedTemplate, student);
      let task = this.groupService.sendEmail(model);
      tasks.push(task);
    });
    return tasks;
  }
  public getEmailBody(selectedTemplate, student: any) {
    const studentName = `${student.firstName} ${student.lastName}`;
    let body = "";
    if (selectedTemplate) {
      body = selectedTemplate.value;
    }
    body = body.replace('{{StudentName}}', studentName)
    return body;
  }
  public getAddress(student) {
    let address = "";
    if (student.homestayOrResi == "1") {
      if (student.homestayID) {
        const homeStay = this.homeStayList.find(
          (row) => row.homeId === student.homestayID
        );
        if (homeStay) {
          address = homeStay.address;
        }
      }
    } else if (student.homestayOrResi == "2") {
      const camp = student.roomSearchCampus || student.campus
      const campus = this.campusList.find(
        (row) => row.id === camp
      );
      address = `${campus.addressOnReports}`;
    }
    return address;
  }
  onAgentSelect(agency: any) {
    this.studentEmail = agency.email;
    this.studentList = [...this.allStudentList.filter(row => row.agencyID === agency.id)];
  }
  onTemplateSelect(template: any) {
    this.emailBody = template.value;
  }
}
