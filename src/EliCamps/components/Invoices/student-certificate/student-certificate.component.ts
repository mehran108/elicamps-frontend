import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Student, ProgrameAddins } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { GroupService } from 'src/EliCamps/services/group.service';
import { ListService } from 'src/EliCamps/services/list.service';
import { convertToPdf } from 'src/EliCamps/common/lookup.enums';
@Component({
  selector: 'app-student-certificate',
  templateUrl: './student-certificate.component.html',
  styleUrls: ['./student-certificate.component.css']
})
export class StudentCertificateComponent implements OnInit {
 public defaultColDef;

  public hide = false;
  public loading = false;
  public studentId: number;
  public student: Student;
  public currentDate = new Date();
  public addinsList: ProgrameAddins[] = [];
  constructor(public route: ActivatedRoute, public groupService: GroupService, public listService: ListService) { }

  ngOnInit() {
    this.getParams();
    const params = {
      active: true
    };
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinsList = res.data;
    });
  }

  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.studentId) {
        this.studentId = Number(atob(params.studentId));
        if (this.studentId) {
          this.getSelectedStudent(this.studentId);
        }
      }
    });
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
  public captureScreen() {
    convertToPdf('STUDENT-CERTIFICATE', this.student);
  }
  print = () => {
    window.print();
  }
}
