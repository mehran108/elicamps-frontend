import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student, ProgrameAddins, Agent } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { GroupService } from 'src/EliCamps/services/group.service';
import { ListService } from 'src/EliCamps/services/list.service';
import { convertToPdf } from 'src/EliCamps/common/lookup.enums';
@Component({
  selector: 'app-agent-invoice',
  templateUrl: './agent-invoice.component.html',
  styleUrls: ['./agent-invoice.component.css']
})
export class AgentInvoiceComponent implements OnInit {
 public defaultColDef;

  public hide = false;
  public loading = false;
  public studentId: number;
  public student: Student;
  public currentDate = new Date();
  public addinsList: ProgrameAddins[] = [];
  public agentList: Agent[] = [];
  public campusList = [];
  constructor(public route: ActivatedRoute, public groupService: GroupService, public listService: ListService) { }

  ngOnInit() {
    this.getParams();
    const params = {
      active: true
    };
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinsList = res.data;
    });
    this.listService.getAllAgent(params).subscribe(res => {
      this.agentList = res.data;
    });
    this.listService.getAllCampus(params).subscribe(res => {
      this.campusList = res.data;
    });
  }

  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.studentId) {
        this.studentId = Number(atob(params.studentId));
      }
    });
  }
  getAgentAddress = (student: Student) => {
    if (student) {
      const agentToFind = this.agentList.find(agent => student.agencyID === agent.id);
      if (agentToFind) {
        return agentToFind.address;
      }
    }
  }
  public getCampus = (campus: number) => {
    const campusFind = this.campusList.find(camp => camp.id === campus);
    if (campusFind) {
      return campusFind.addressOnReports || campusFind.completeName;
    }
  }
  public getAddins = (addinList, type: string) => {
    if (addinList && addinList.length > 0) {
      const addinNameList = [];
      addinList.forEach(element => {
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
    this.groupService.getElicampsStudent(studentId).subscribe((student: Student) => {
      this.student = student;
      this.loading = false;
    }, error => {
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
  }
  captureScreen() {
    convertToPdf('AGENT-INVOICE', this.student);
  }
  print = () => {
    window.print();
  }
}
