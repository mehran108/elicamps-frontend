import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public groupInfo = new BehaviorSubject(null);
  public studentInfoSubject = new BehaviorSubject(null);
  public saveRecordSubject = new BehaviorSubject(null);
  private studentInfo: any;
  private flightInfo: any;
  private accomodationInfo: any;
  private programInfo: any;
  private paymentInfo: any;
  private tripInfo: any;
  private medicalInfo: any;
   public defaultColDef;
  constructor() { }

  setStudentInfoState = (studentInfo: any) => {
    this.studentInfo = JSON.stringify(studentInfo);
  }
  getCompleteState = () => {
    return JSON.parse(JSON.stringify({
      ...(this.getStudentInfoState()),
      ...(this.getflightInfotate()),
      ...(this.getmedicalInfotate()),
      ...(this.getpaymentInfoState()),
      ...(this.getaccomodationtate()),
      ...(this.getTripsManagerInfoState()),
      ...(this.getProgramInfoState())
    }));
  }
  setCompleteStateToNull = () => {
    (this.setStudentInfoState(null));
    (this.setflightInfoState(null));
    (this.setProgramInfoState(null));
    (this.setmedicalInfoState(null));
    (this.setpaymentInfoState(null));
    (this.setaccomodationInfoState(null));
    (this.setTripsManagerInfoState(null));
  }
  getStudentInfoState = () => {
    if (!this.studentInfo) {
      return null;
    } else {
      return JSON.parse(this.studentInfo);
    }
  }

  setflightInfoState = (flightInfo: any) => {
    this.flightInfo = JSON.stringify(flightInfo);
  }
  getflightInfotate = () => {
    if (!this.flightInfo) {
      return null;
    } else {
      return JSON.parse(this.flightInfo);
    }
  }

  setmedicalInfoState = (medicalInfo: any) => {
    this.medicalInfo = JSON.stringify(medicalInfo);
  }
  getmedicalInfotate = () => {
    if (!this.medicalInfo) {
      return null;
    } else {
      return JSON.parse(this.medicalInfo);
    }
  }
  setProgramInfoState = (programInfoState: any) => {
    this.programInfo = JSON.stringify(programInfoState);
  }
  getProgramInfoState = () => {
    if (!this.programInfo) {
      return null;
    } else {
      return JSON.parse(this.programInfo);
    }
  }



  setaccomodationInfoState = (accomodationInfo: any) => {
    this.accomodationInfo = JSON.stringify(accomodationInfo);
  }
  getaccomodationtate = () => {
    if (!this.accomodationInfo) {
      return null;
    } else {
      return JSON.parse(this.accomodationInfo);
    }
  }

  setpaymentInfoState = (paymentInfo: any) => {
    this.paymentInfo = JSON.stringify(paymentInfo);
  }
  getpaymentInfoState = () => {
    if (!this.paymentInfo) {
      return null;
    } else {
      return JSON.parse(this.paymentInfo);
    }
  }

  setTripsManagerInfoState = (tripInfo: any) => {
    this.tripInfo = JSON.stringify(tripInfo);
  }
  getTripsManagerInfoState = () => {
    if (!this.tripInfo) {
      return null;
    } else {
      return JSON.parse(this.tripInfo);
    }
  }

  setgroupInfoState = (studentInfo: any) => {
    this.groupInfo.next(studentInfo);
  }
  getGroupInfoState = () => {
    return this.groupInfo;
  }
  setObservable = (value: any) => {
    this.studentInfoSubject.next(value);
  }
  getObservable = (): Observable<any> => {
    return this.studentInfoSubject.asObservable();
  }
  saveRecord = (value: any) => {
    this.saveRecordSubject.next(value);
  }
  getRecord = (): Observable<any> => {
    return this.saveRecordSubject.asObservable();
  }
exportInsuranceEnrollment(data: Array<any>): void {
    // 1) Build our raw data rows
        const list = data.map((row) => {
      return [
        row.status,
        row.id,
        row.firstName,
        row.lastName,
        row.dob ? moment(row.dob).format('MM-DD-YYYY'): '',
        row.gender,
        "",
        "",
        row.destinationTo,
        row.city,
        moment(row.programeStartDate).format('MM-DD-YYYY'),
        moment(row.programeEndDate).format('MM-DD-YYYY'),
        "",
        "",
        "",
        "",
        row.email,
        row.numberOfNights,
      ];
    });
    const wsData = [
      ['Dept #', '4475', '', '', '', '', '', 'Origin:', 'Means the country where the applicant permanently resides'],
      ['Contact Name:', 'Blerta Mrizi / Elvis Mrizi'],
      ['Email:', 'blerta@elicamps.com', '', '', '', '', '', '', ''],
      [' ', 'elvis@elicamps.com'],
      [],
      ['Date Format:', 'DD‑MMM‑YY e.g. 01‑Jan‑1980'],
      [],
      ['Status :', 'O = New', 'EX = Extension', 'X = Cancellation', 'ER = Early Return Cancellation'],
      [],
      ['Mandatory fields marked with asterisks * must be completed to issue the policies'],
      ['GuardMe International Insurance Enrollment Form - Inbound to Canada'],
      [],
      [
        'Status','Student #','First Name*','Last Name*','Birthdate*',
        'Gender*','Select from the list','Origin','Destination Country*',
        'City','Start Date*','End Date*','ER Date','Policy#',
        'Group Name','Comments','Email*','Number of Days'
      ],
      ...data,
      // sample blank rows:
    ];
    // 2) Convert to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

    // 3) Merges (title row & header row)
    ws['!merges'] = [
      // merge title ("GuardMe..." row 11 zero‑based) across A–F
      { s: { r: 10, c: 0 }, e: { r: 10, c: 5 } }
    ];

    // 4) Column widths
    ws['!cols'] = new Array(18).fill({ wch: 20 });

    // 5) Basic styling
    const range = XLSX.utils.decode_range(ws['!ref']!);

    // — Style the very first title cell (A11)
    const titleCell = ws['A11'];
    if (titleCell) {
      titleCell.s = {
        font: { bold: true, sz: 14, color: { rgb: 'FF006600' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // — Style section headers (column‑A cells at rows 0,1,2…)
    [0,1,2,4,5,7,9].forEach(r => {
      const cell = ws[ `A${r+1}` ];
      if (cell) {
        cell.s = { font: { bold: true }, fill: { fgColor: { rgb: 'FFD9D9D9' } } };
      }
    });

    // — Style table header row (row 12 zero‑based: Excel row 13)
    const headerRow = 12;
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: headerRow, c });
      const cell = ws[addr];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFFFF' } },
          fill: { fgColor: { rgb: 'FF1F4E78' } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    }

    // 6) Assemble workbook and write
    const wb: XLSX.WorkBook = {
      Sheets: { 'Enrollment Form': ws },
      SheetNames: ['Enrollment Form']
    };
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 7) Trigger download
    const blob = new Blob([buf], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(blob, `Insurance_Enrollment_Form_2025_${Date.now()}.xlsx`);
  }
}

