import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Group, PaymentGroup, TripsMangerModel } from '../EliCamps-Models/Elicamps';
import { ReplaySubject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { Keys } from '../common/lookup.enums';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private TripsMangerState: ReplaySubject<TripsMangerModel>;
   public defaultColDef;
  constructor(public httpClient: HttpClient, public storage: LocalstorageService) {
    this.TripsMangerState = new ReplaySubject<TripsMangerModel>();
  }

  // Add Elicamps Group
  public addElicampsGroup = (model: Group) => {
    return this.httpClient.post<Group>(`${environment.appGroup}/addGroup`, model);
  }
  // Get Elicamps Group By GroupId
  public getElicampsGroup = (groupId: number, isGroupInvoice?: boolean) => {
    if (isGroupInvoice) {
      return this.httpClient.get(`${environment.appGroup}/getGroup?groupId=${groupId}&isInvoice=${isGroupInvoice}`);
    } else {
      return this.httpClient.get(`${environment.appGroup}/getGroup?groupId=${groupId}&isInvoice=false`);
    }
  }
  // Get Elicamps Groups List
  public getAllElicampsGroups = (params) => {
    return this.httpClient.get(`${environment.appGroup}/getAllGroups`, { params: params || {} });
  }
  // Update Elicamps Group By GroupId
  public updateElicampsGroups = (model: Group) => {
    return this.httpClient.put(`${environment.appGroup}/updateGroup`, model);
  }
  // Update Group Program
  public updateGroupProgram = (model: Group) => {
    return this.httpClient.put(`${environment.appGroup}/updateGroupPrograme`, model);
  }
  // Update Group Payment
  public updateGroupPayment = (model: Group) => {
    return this.httpClient.put(`${environment.appGroup}/groupPayment`, model);
  }
  // Get All Group Payment
  public getAllPaymentGroupByGroupId = (groupId: number) => {
    return this.httpClient.get<any>(`${environment.appGroup}/getAllPaymentGroupByGroupId?groupId=${groupId}&active=true`);
  }
  // Add Group Payment
  public addPaymentGroup = (model: PaymentGroup) => {
    return this.httpClient.post<any>(`${environment.appGroup}/addPaymentGroup`, model);
  }
  // Update Group Payment
  public updatePaymentGroup = (model: PaymentGroup) => {
    return this.httpClient.put<any>(`${environment.appGroup}/updatePaymentGroup`, model);
  }
  // Get Group Payment
  public getPaymentGroup = (paymentGroupId: number) => {
    return this.httpClient.get<PaymentGroup>(`${environment.appGroup}/getPaymentGroup?paymentGroupId=${paymentGroupId}`);
  }
  // Get All Group Payment
  public getAllPaymentGroupLeaderByGroupId = (groupId: number) => {
    return this.httpClient.get<any>(`${environment.appGroup}/getAllPaymentGroupLeaderByGroupId?groupId=${groupId}&active=true`);
  }
  // Add Group Payment
  public addPaymentGroupLeader = (model: any) => {
    return this.httpClient.post<any>(`${environment.appGroup}/addPaymentGroupLeader`, model);
  }
  // Update Group Payment
  public updatePaymentGroupLeader = (model: any) => {
    return this.httpClient.put<any>(`${environment.appGroup}/updatePaymentGroupLeader`, model);
  }
  // Get Group Payment
  public getPaymentGroupLeader = (paymentGroupId: number) => {
    return this.httpClient.get<any>(`${environment.appGroup}/getPaymentGroupLeader?paymentGroupLeaderId=${paymentGroupId}`);
  }
  setTripsMangerState = (tripsManager: TripsMangerModel) => {
    return this.TripsMangerState.next(tripsManager);
  }
  getTripsMangerState = () => {
    return this.TripsMangerState;
  }

  public updateGrouptrips = (model: any) => {
    return this.httpClient.put(`${environment.appGroup}/updateGroupTrips`, model);
  }
  //// Get Student bY ID
  public getElicampsStudent = (studentId: number) => {
    return this.httpClient.get(`${environment.appStudent}/getStudent?studentID=${studentId}`);
  }

  // Get Elicamps Groups List
  public getAllElicampsStudents = (params) => {
    return this.httpClient.get(`${environment.appStudent}/getAllStudent`, { params });
  }
  public sendEmail = (params) => {
    return this.httpClient.post(`${environment.appStudent}/emailSend`, params);
  }

  public addPaymentStudent = (model: any) => {
    return this.httpClient.post<any>(`${environment.appStudent}/createPaymentStudent`, model);
  }
  // Update Group Payment
  public updatePaymentStudent = (model: any) => {
    return this.httpClient.put<any>(`${environment.appStudent}/updatePaymentStudent`, model);
  }
  public activateGroup = (model: any) => {
    return this.httpClient.put<any>(`${environment.appGroup}/activateGroup`, model);
  }
  public deleteGroup = (model: any) => {
    return this.httpClient.put<any>(`${environment.appGroup}/deleteGroup`, model);
  }
  public activatePaymentGroup = (model: any) => {
    return this.httpClient.put<any>(`${environment.appGroup}/activatePaymentGroup`, model);
  }
  public activatePaymentGroupLeader = (model: any) => {
    return this.httpClient.put<any>(`${environment.appGroup}/activatePaymentGroupLeader`, model);
  }
  // Get Group Payment
  public getPaymentStudent = (paymentStudentID: number) => {
    return this.httpClient.get<any>(`${environment.appStudent}/getPaymentStudent?paymentStudentID=${paymentStudentID}`);
  }
  public getAllPaymentStudentByStudentId = (studentId: number) => {
    return this.httpClient.get<any>(`${environment.appStudent}/getAllPaymentStudentByStudentId?studentId=${studentId}`);
  }
  public documentGetByStudentId(model: any) {
    if (!model.registrationFee) {
      model.registrationFee = 0;
    }
    return this.httpClient.post(`${environment.appStudent}/documentGetByStudentId`, model,{ responseType: 'blob' });
  }
}
