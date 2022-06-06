import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Student, ProgrameAddins, Campus } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { GroupService } from 'src/EliCamps/services/group.service';
import { ListService } from 'src/EliCamps/services/list.service';
import { convertToPdf } from 'src/EliCamps/common/lookup.enums';
@Component({
  selector: 'app-student-airport-invoice',
  templateUrl: './student-airport-invoice.component.html',
  styleUrls: ['./student-airport-invoice.component.css']
})
export class StudentAirportInvoiceComponent implements OnInit {
 public defaultColDef;

  public hide = false;
  public loading = false;
  public studentId: number;
  public student: Student;
  public currentDate = new Date();
  public addinsList: ProgrameAddins[] = [];
  public campusList: Campus[] = [];
  public showHidePrice = false;
  constructor(public route: ActivatedRoute, public groupService: GroupService, public listService: ListService) { }

  ngOnInit() {
    this.getParams();
    const params = {
      active: true
    };
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinsList = res.data;
    });
    this.listService.getAllCampus(params).subscribe(res => {
      this.campusList = res.data;
    });
  }
  public getCampus = (campus: number) => {
    const campusFind = this.campusList.find(camp => camp.id === campus);
    if (campusFind) {
      return campusFind.addressOnReports || campusFind.completeName;
    }
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.studentId) {
        this.studentId = Number(atob(params.studentId));
        if (this.studentId) {
          this.getSelectedStudent(this.studentId);
        }
        if (params.section) {
          this.showHidePrice = params.section === 'true' ? true : false;
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
    convertToPdf('AIRPORT-DOCUMENT', this.student);
  }
  print = () => {
    window.print();
  }
}
