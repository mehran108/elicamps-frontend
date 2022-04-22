import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent, Room, Trip, ProgrameAddins, Campus, HomeStay, Program, SubProgram, StudentDocuments } from '../EliCamps-Models/Elicamps';
import { environment } from '../../environments/environment';
import { LocalstorageService } from './localstorage.service';
import { Keys } from '../common/lookup.enums';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private httpClient: HttpClient, public storage: LocalstorageService) { }
  get RegistrationFee() {
    return this.storage.get(Keys.REG_FEE);
  }
  /**
   * Get All
   */
  public getAll(lookupTable: string) {
    return this.httpClient.get<any>(`${environment.appList}/getListTypeByLookupTable?lookupTable=${lookupTable}`);
  }
  public CreateLookupValue(model) {
    return this.httpClient.post<any>(`${environment.appList}/createLookupValue`, model);
  }
  public UpdateLookupValue(model) {
    return this.httpClient.post<any>(`${environment.appList}/UpdateLookupValue`, model);
  }
  public DeleteLookupValue(model) {
    return this.httpClient.post<any>(`${environment.appList}/DeleteLookupValue`, model);
  }
  /**
   * Add New Trip
   */
  public addTrip(model: Trip) {
    return this.httpClient.post(`${environment.appList}/createTrips`, model);
  }
  /**
   * Get Trip List
   */
  public getAllTrips() {
    return this.httpClient.get<any>(`${environment.appList}/getAllTrips`);
  }
  /**
   * Get Trip
   */
  public getTripById(tripId: number) {
    return this.httpClient.get<any>(`${environment.appList}/getTrip?tripId=${tripId}`);
  }
  /**
   * Update Trip
   */
  public updateTrips(model: Trip) {
    return this.httpClient.put(`${environment.appList}/updateTrips`, model);
  }
  /**
   * Activate Trip
   */
  public activateTrips(model: Trip) {
    return this.httpClient.post(`${environment.appList}/activateTrips`, model);
  }
  /**
   * Add New Room
   */
  public addRoom(model: Room) {
    return this.httpClient.post(`${environment.appList}/createRoom`, model);
  }
  public updateRoom(model: Room) {
    return this.httpClient.put(`${environment.appList}/updateRoom`, model);
  }
  /**
   * Get All Agents
   */
  public getAllRoomList() {
    return this.httpClient.get<any>(`${environment.appList}/getAllRoomList`);
  }
  /**
   * Get Room
   */
  public getRoomById(roomId: number) {
    return this.httpClient.get<any>(`${environment.appList}/getRoomById?roomId=${roomId}`);
  }
  /**
   * Get All Agents
   */
  public getAllAgent(params) {
    return this.httpClient.get<any>(`${environment.appList}/getAllAgent`, { params: params || {} });
  }
  /**
   * Add New Agent
   */
  public addAgent(model: Agent) {
    return this.httpClient.post(`${environment.appList}/createAgent`, model);
  }
  /**
   * Update Agent
   */
  public updateAgent(model: Agent) {
    return this.httpClient.put(`${environment.appList}/updateAgent`, model);
  }
  /**
   * Get Agent
   */
  public getAgent(agentId: number) {
    return this.httpClient.get<Agent>(`${environment.appList}/getAgent?agentId=${agentId}`);
  }
  /**
   * Get All Addins
   */
  public getAllAddins(params) {
    return this.httpClient.get<any>(`${environment.appList}/getAllAddins`, { params: params || {} });
  }
  /**
   * Get Addin
   */
  public getAddins(addinsId: number) {
    return this.httpClient.get<ProgrameAddins>(`${environment.appList}/getAddins?addinsId=${addinsId}`);
  }
  /**
   * Update Addin
   */
  public updateAddins(model: ProgrameAddins) {
    return this.httpClient.put(`${environment.appList}/updateAddins`, model);
  }
  /**
   * Add Addin
   */
  public addAddins(model: ProgrameAddins) {
    return this.httpClient.post(`${environment.appList}/createAddins`, model);
  }
  /**
   * Get All Campus
   */
  public getAllCampus = (params: any) => {
    return this.httpClient.get<any>(`${environment.appList}/getAllCampus`, { params: params || {} });
  }
  /**
   * Get Campus
   */
  public getCampus(campusId: number) {
    return this.httpClient.get<Campus>(`${environment.appList}/getCampus?campusId=${campusId}`);
  }
  /**
   * Update Campus
   */
  public updateCampus(model: Campus) {
    return this.httpClient.put(`${environment.appList}/updateCampus`, model);
  }
  /**
   * Add Campus
   */
  public addCampus(model: Campus) {
    return this.httpClient.post(`${environment.appList}/createCampus`, model);
  }
  /**
   * Get All HomeStay
   */
  public getAllHomeStay() {
    return this.httpClient.get<any>(`${environment.appList}/getAllHomeStay`);
  }
  /**
   * Get HomeStay
   */
  public getHomeStay(homeStayId: number) {
    return this.httpClient.get<HomeStay>(`${environment.appList}/getHomeStay?homeStayId=${homeStayId}`);
  }
  /**
   * Update HomeStay
   */
  public updateHomeStay(model: HomeStay) {
    return this.httpClient.put(`${environment.appList}/updateHomeStay`, model);
  }
  /**
   * Add HomeStay
   */
  public addHomeStay(model: HomeStay) {
    return this.httpClient.post(`${environment.appList}/createHomeStay`, model);
  }
  public getAllProgram(params) {
    return this.httpClient.get<any>(`${environment.appList}/getAllProgram`, { params: params || {} });
  }
  /**
   * Get Program
   */
  public getProgram(ProgramId: number) {
    return this.httpClient.get<Program>(`${environment.appList}/getProgram?ProgramId=${ProgramId}`);
  }
  /**
   * Update Program
   */
  public updateProgram(model: Program) {
    return this.httpClient.put(`${environment.appList}/updateProgram`, model);
  }
  /**
   * Add Program
   */
  public addProgram(model: Program) {
    return this.httpClient.post(`${environment.appList}/createProgram`, model);
  }
  public getAllSubProgram(params) {
    return this.httpClient.get<any>(`${environment.appList}/getAllSubProgram`, { params: params || {} });
  }
  public getSubProgramByProgramId(programId?: number) {
    return this.httpClient.get<any>(`${environment.appList}/getAllSubProgram?programId=${programId}&active=true`);
  }
  /**
   * Get SubProgram
   */
  public getSubProgram(SubProgramId: number) {
    return this.httpClient.get<SubProgram>(`${environment.appList}/getSubProgram?SubProgramId=${SubProgramId}`);
  }
  /**
   * Update SubProgram
   */
  public updateSubProgram(model: SubProgram) {
    return this.httpClient.put(`${environment.appList}/updateSubProgram`, model);
  }
  public activatePaymentStudent(model: any) {
    return this.httpClient.put(`${environment.appStudent}/activatePaymentStudent`, model);
  }
  /**
   * Add SubProgram
   */
  public addSubProgram(model: SubProgram) {
    return this.httpClient.post(`${environment.appList}/createSubProgram`, model);
  }
  /**
   *
   *
   *
   */

  public addStudentInfo(model: any) {
    if (!model.registrationFee) {
      model.registrationFee = 0;
    }
    return this.httpClient.post(`${environment.appStudent}/createStudent`, model);
  }

  public updateStudentInfo(model: any) {
    if (!model.registrationFee) {
      model.registrationFee = 0;
    }
    return this.httpClient.put(`${environment.appStudent}/updateStudent`, model);
  }
  public activateStudent(model: any) {
    return this.httpClient.put(`${environment.appStudent}/activateStudent`, model);
  }
  public deleteStudent(model: any) {
    return this.httpClient.put(`${environment.appStudent}/deleteStudent`, model);
  }

  public uploadDoument(model: any) {
    if (model.studentEmail && model.files) {
      return this.httpClient.post(`${environment.appStudent}/uploadDocuments`, model);
    }
  }
  public uploadStudentProfile(model: any) {
    if (model.studentEmail && model.files) {
      return this.httpClient.post(`${environment.appFile}/UploadStudentPic`, model);
    }
    const formData = new FormData();
    formData.append('files', model.Files);
    return this.httpClient.post(`${environment.appStudent}/uploadDocuments`, formData);
  }
  public getPaymentReport(year: number) {
    return this.httpClient.get<any>(`${environment.appReporting}/GetPaymentReportByYear?year=${year}`);
  }
  public getInsuranceReport() {
    return this.httpClient.get<any>(`${environment.appReporting}/GetInsuranceReport`);
  }
}
