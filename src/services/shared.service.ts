import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';

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
}

