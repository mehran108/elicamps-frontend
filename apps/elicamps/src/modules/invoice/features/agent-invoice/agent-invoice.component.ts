/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { convertToPdf } from 'apps/elicamps/src/common/lookup.enums';
import { Student, ProgrameAddins } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { Agent } from 'http';
@Component({
  selector: 'app-agent-invoice',
  templateUrl: './agent-invoice.component.html',
  styleUrls: ['./agent-invoice.component.css']
})
export class AgentInvoiceComponent implements OnInit {

  public hide = false;
  public loading = false;
  public studentId!: number;
  public student!: Student;
  public currentDate = new Date();
  public addinsList: ProgrameAddins[] = [];
  public agentList: Agent[] = [];
  public campusList: any;;
  constructor(public route: ActivatedRoute, public groupService: GroupService, public listService: ListService) { }

  ngOnInit() {
    this.getParams();
    const params = {
      active: true
    };
    this.listService.getAllAddins(params).subscribe((res: any) => {
      this.addinsList = res.data;
    });
    this.listService.getAllAgent(params).subscribe((res: any) => {
      this.agentList = res.data;
    });
    this.listService.getAllCampus(params).subscribe((res: any) => {
      this.campusList = res.data;
    });
  }

  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params['studentId']) {
        this.studentId = Number(atob(params['studentId']));
      }
    });
  }
  getAgentAddress = (student: Student) => {
    if (student) {
      const agentToFind: any = this.agentList.find((agent: any) => student.agencyID === agent.id);
      if (agentToFind) {
        return agentToFind.address;
      }
    }
  }
  public getCampus = (campus: any) => {
    const campusFind = this.campusList.find((camp: any) => camp.id === campus);
    if (campusFind) {
      return campusFind['addressOnReports'] || campusFind['completeName'];
    }
  }
  public getAddins = (addinList: any, type: string) => {
    if (addinList && addinList.length > 0) {
      const addinNameList: any = [];
      addinList.forEach((element: any) => {
        const findAddin = this.addinsList.find(addin => addin.id === element && addin.addinsType.toLowerCase() === type.toLowerCase());
        if (findAddin) {
          addinNameList.push(findAddin.addins);
        }
      });
      return addinNameList;
    }
  }
  public getSelectedStudent = (studentId: number) => {
    this.loading = true;
    this.groupService.getElicampsStudent(studentId).subscribe((student: any) => {
      this.student = student;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
    });
  }
  // public captureScreen() {
  //   this.hide = true;
  //   const data = document.getElementById('invoice');
  //   const buttons = document.getElementById('btns');
  //   buttons.className = 'action-panel no-print d-none';
  //   html2canvas(data).then(canvas => {
  //     // Few necessary setting options
  //     const imgWidth = 208;
  //     const pageHeight = 295;
  //     const imgHeight = canvas.height * imgWidth / canvas.width;
  //     const heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');
  //     const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //     const position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save(`AGENT-INVOICE${this.student.reg_Ref}.pdf`); // Generated PDF;
  //     this.hide = false;
  //     buttons.className = 'action-panel no-print';
  //   });
  // }
  getCommissionValue = (student: Student) => {
    if (student) {
      const value = (student.commision * student.totalGrossPrice) / 100;
      return value;
    }
    return 0;
  }
  captureScreen() {
    convertToPdf('AGENT-INVOICE', this.student);
  }
  print = () => {
    window.print();
  }
}
