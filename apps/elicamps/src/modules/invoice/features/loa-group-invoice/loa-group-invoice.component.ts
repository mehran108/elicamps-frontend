/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { convertToPdf } from 'apps/elicamps/src/common/lookup.enums';
import { Student, ProgrameAddins, Campus } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { ListService } from 'apps/elicamps/src/services/list.service';
@Component({
  selector: 'app-loa-group-invoice',
  templateUrl: './loa-group-invoice.component.html',
  styleUrls: ['./loa-group-invoice.component.css']
})
export class LoaGroupInvoiceComponent implements OnInit {

  public hide = false;
  public loading = false;
  public studentId!: number;
  public student!: Student;
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
    this.listService.getAllAddins(params).subscribe((res: any) => {
      this.addinsList = res.data;
    });
    this.listService.getAllCampus(params).subscribe((res: any) => {
      this.campusList = res.data;
    });
  }
  public getCampus = (campus: number) => {
    const campusFind = this.campusList.find(camp => camp.id === campus);
    if (campusFind) {
      return campusFind.addressOnReports || campusFind.completeName;
    }
    return '';
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params['studentId']) {
        this.studentId = Number(atob(params['studentId']));
        if (this.studentId) {
          this.getSelectedStudent(this.studentId);
        }
        if (params['section']) {
          this.showHidePrice = params['section'] === 'true' ? true : false;
        }
      }
    });
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
    }, error => {
      this.loading = false;
    });
  }
  getCommissionValue = (student: Student) => {
    if (student) {
      const value = (student.commision * student.totalGrossPrice) / 100;
      return value;
    }
    return 0;
  }
  public captureScreen() {
    convertToPdf('LOA-INOICE', this.student);
  }
  print = () => {
    window.print();
  }
}
