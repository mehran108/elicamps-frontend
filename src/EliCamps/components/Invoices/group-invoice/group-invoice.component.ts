import { Component, OnInit } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { Student, ProgrameAddins, Campus, Group, Agent, Program, LookupTable, SubProgram } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { GroupService } from 'src/EliCamps/services/group.service';
import { ListService } from 'src/EliCamps/services/list.service';
import { convertToPdf, LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-group-invoice',
  templateUrl: './group-invoice.component.html',
  styleUrls: ['./group-invoice.component.css']
})
export class GroupInvoiceComponent implements OnInit {

  public hide = false;
  public loading = false;
  public groupId: number;
  public group: Group;
  public currentDate = new Date();
  public addinsList: ProgrameAddins[] = [];
  public campusList: Campus[] = [];
  public agentList: Agent[] = [];
  public programList: Program[] = [];
  public subProgramList: SubProgram[] = [];
  public formatList: LookupTable[] = [];
  public groupPaymentLeaderList = [];
  public showHidePrice = true;
  public isGross = true;
  public groupInvoice = false;
  public allStudents = [];
  public studentList = [];
  constructor(
    public route: ActivatedRoute,
    public groupService: GroupService,
    public listService: ListService,
    public datePipe: DatePipe) { }

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
    this.listService.getAllAgent(params).subscribe(res => {
      this.agentList = res.data;
    });
    this.listService.getAllProgram(params).subscribe(res => {
      this.programList = res.data;
    });
    this.listService.getAll(LookupEnum.FORMAT).subscribe(res => {
      this.formatList = res;
    });
    this.groupService.getAllElicampsStudents({}).subscribe((res: any) => {
      this.studentList = res.data;
      this.allStudents = res.data.filter(student => student.chapFamily === 'Chaperone');
      this.allStudents = this.allStudents.filter(row => row.groupRef === this.groupId.toString()).map(std => ({ refNumber: std.reg_Ref, amount: std.totalGrossPrice }));
    });
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.groupId) {
        if (params.invoiceType) {
          this.isGross = params.invoiceType === 'Gross' ? true : false;
        }
        if (params.groupInvoice) {
          this.groupInvoice = params.groupInvoice === 'true' ? true : false;
        }
        this.groupId = Number(atob(params.groupId));
        if (this.groupId) {
          this.getSelectedGroup(this.groupId);
          this.groupService.getAllPaymentGroupLeaderByGroupId(this.groupId).subscribe(res => {
            this.groupPaymentLeaderList = res;
            this.groupPaymentLeaderList = this.groupPaymentLeaderList.filter(payment => payment.active);
          });
        }
      }
    });
  }
  public getCampus = (campus: number) => {
    const campusFind = this.campusList.find(camp => camp.id === campus);
    if (campusFind) {
      return campusFind.addressOnReports || campusFind.completeName;
    }
  }
  public getAgencyName = (agentId: number) => {
    if (agentId) {
      if (this.agentList.find(res => res.id === agentId)) {
        return this.agentList.find(res => res.id === agentId).agent;
      }
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
  public getSelectedGroup = (groupId: number) => {
    this.loading = true;
    this.groupService.getElicampsGroup(groupId, this.groupInvoice ? false : true).subscribe((student: Group) => {
      this.group = student;
      if (this.group && this.group.subProgramId) {
        this.listService.getSubProgram(this.group.programId).subscribe(res => {
          this.subProgramList = (res as any).data;
        });
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
  public captureScreen() {
    convertToPdf('GROUP-INOICE', this.group);
  }
  public getPriceByType = (group) => {
    if (group) {
      if (this.groupInvoice) {
        return this.isGross ? group.totalGrossPrice : group.totalGrossPrice;
      } else {
        return this.isGross ? group.studentsAgainstGroup.totalGrossPrice : group.studentsAgainstGroup.totalGrossPrice;
      }
    }
  }
  public getDueBalance = (group) => {
    if (group) {
      if (this.groupInvoice) {
        return this.isGross ?
          group.totalGrossPrice - group.paid :
          group.balance;
      } else {
        return this.isGross ?
          group.studentsAgainstGroup.totalGrossPrice - group.studentsAgainstGroup.paid :
          (group.studentsAgainstGroup.totalGrossPrice - this.getCommission(group.studentsAgainstGroup.commision, false))
          - group.studentsAgainstGroup.paid;
      }

    }
  }
  public getCommission = (commision: number, isGroupInvoice: boolean) => {
    if (commision) {
      let commissionValue = 0;
      if (isGroupInvoice) {
        commissionValue = ((commision * this.group.totalGrossPrice) / 100);
      } else {
        const list = this.studentList.filter(res => res.groupID === this.groupId);
        if (list.length > 0) {
          let groupedCommission = 0;
          list.forEach(std => {
            if (std.commision) {
              groupedCommission += ((std.commision * std.totalGrossPrice) / 100);
            }
          });
          commissionValue = groupedCommission;
        }
      }
      return commissionValue;
    }
  }
  public getNameFromList = (listName: string) => {
    if (this.group) {
      switch (listName) {
        case 'Program': {
          const program = this.programList.find(res => this.group.programId === res.id);
          return program ? program.programName : '';
        }
        case 'SubProgram': {
          const subProgram = this.subProgramList.find(res => this.group.subProgramId === res.id);
          return subProgram ? subProgram.subProgramName : '';
        }
        case 'Format': {
          const format = this.formatList.find(res => this.group.format === res.value);
          return format ? format.name : '';
        }
      }
    }
  }
  public getList() {
    return !this.groupInvoice ? this.allStudents : this.groupPaymentLeaderList;
  }
  print = () => {
    window.print();
  }
}
