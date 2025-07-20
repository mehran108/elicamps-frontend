import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
   import * as _XLSX from 'xlsx-js-style';
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

  const list = data.map((row) => [
    '',
    row.status,
    row.id,
    row.firstName,
    row.lastName,
    row.dob ? moment(row.dob).format('MM-DD-YYYY') : '',
    row.gender,
    row.country,
    row.destinationTo,
    row.city,
    moment(row.programeStartDate).format('MM-DD-YYYY'),
    moment(row.programeEndDate).format('MM-DD-YYYY'),
    '',
    '',
    row.agencyRef,
    '',
    row.email,
    row.numberOfNights,
  ]);

  const wsData = [
    ['', 'Dept #', '4475', '', '', '', '', '', 'Origin:', 'Means the country where the applicant permanently resides'],
    ['', 'Contact Name:', 'Blerta Mrizi / Elvis Mrizi'],
    ['', 'Email:', 'blerta@elicamps.com', '', '', '', '', '', '', ''],
    ['', ' ', 'elvis@elicamps.com'],
    [''],
    ['', 'Date Format:', 'DD‑MMM‑YY e.g. 01‑Jan‑1980'],
    [''],
    ['', 'Status :', 'O = New', 'EX = Extension', 'X = Cancellation', 'ER = Early Return Cancellation'],
    [],
    ['', 'Mandatory fields marked with asterisks * must be completed to issue the policies'],
    ['', 'GuardMe International Insurance Enrollment Form - Inbound to Canada'],
    ['', ],
    [
      '', 'Status', 'Student #', 'First Name*', 'Last Name*', 'Birthdate*',
      'Gender*', 'Origin', 'Destination Country*',
      'City', 'Start Date*', 'End Date*', 'ER Date', 'Policy#',
      'Group Name', 'Comments', 'Email*', 'Number of Days'
    ],
    ...list
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Merge the title row (Excel row 11)
  ws['!merges'] = [
    { s: { r: 10, c: 0 }, e: { r: 10, c: 5 } } // A11 to F11
  ];

  // Set column widths
  ws['!cols'] = new Array(18).fill({ wch: 20 });

  // Set row height for title row
  ws['!rows'] = [];
  ws['!rows'][10] = { hpt: 25 };

  const range = XLSX.utils.decode_range(ws['!ref']!);
  const headerRow = 12;

  // Style title row
  const titleCell = ws['A11'];
  if (titleCell) {
    titleCell.s = {
      font: { bold: true, sz: 14, color: { rgb: 'FF006600' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  // Style section headers (label cells in rows 0–9)
  [0, 1, 2, 3, 4, 5, 6, 7, 9].forEach(r => {
    const cell = ws[`A${r + 1}`];
    if (cell) {
      cell.s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'FFD9D9D9' } }
      };
    }
  });

  // Style table headers (row 13 / index 12)
  for (let c = range.s.c; c <= range.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: headerRow, c });
    const cell = ws[addr];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFFFF' } },
        fill: { fgColor: { rgb: 'FF1F4E78' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top:    { style: 'thin', color: { rgb: 'FFAAAAAA' } },
          bottom: { style: 'thin', color: { rgb: 'FFAAAAAA' } },
          left:   { style: 'thin', color: { rgb: 'FFAAAAAA' } },
          right:  { style: 'thin', color: { rgb: 'FFAAAAAA' } }
        }
      };
    }
  }

  // Style all data cells (starting from row 14)
  for (let R = headerRow + 1; R <= range.e.r; ++R) {
    for (let C = 0; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[addr];
      if (cell) {
        cell.s = {
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top:    { style: 'thin', color: { rgb: 'FFCCCCCC' } },
            bottom: { style: 'thin', color: { rgb: 'FFCCCCCC' } },
            left:   { style: 'thin', color: { rgb: 'FFCCCCCC' } },
            right:  { style: 'thin', color: { rgb: 'FFCCCCCC' } }
          }
        };
      }
    }
  }

  // Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: 13 };

  const wb: _XLSX.WorkBook = {
    Sheets: { 'Enrollment Form': ws },
    SheetNames: ['Enrollment Form']
  };

  const buf = _XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  FileSaver.saveAs(blob, `Insurance_Enrollment_Form_2025_${Date.now()}.xlsx`);
  }
}

