export interface Agent {
  agentId?: number;
  id?: number;
  agent: string;
  contact: string;
  phone: string;
  email: string;
  web: string;
  address: string;
  country: string;
  notes: string;
  other: string;
  active: boolean;
  [propNme: string]: any;
}
export interface Room {
  roomID?: number;
  campusID: string;
  building: string;
  roomType: string;
  floor: string;
  ldx: string;
  notes: string;
  bookedFrom: string;
  bookedTo: string;
  available: string;
  availableFrom: boolean;
  availableTo: boolean;
  importedOne: boolean;
  weekno: boolean;
  year: boolean;
  [propNme: string]: any;
}
export interface Group {
  groupId?: number;
  id?: number;
  year: string;
  camps: number;
  refNumber: string;
  agentId: number;
  agencyRef: string;
  country: string;
  arrivalDate: string;
  terminal: string;
  flightNumber: string;
  destinationFrom: string;
  arrivalTime: string;
  departureDate: string;
  departureTerminal: string;
  departureFlightNumber: string;
  destinationTo: string;
  flightDepartureTime: string;
  active: boolean;
  [propNme: string]: any;
}
export interface Student {
  id?: number;
  year: string;
  reg_Ref: string;
  grpRef: string;
  groupRef: number;
  camps: number;
  gender: string;
  firstName: string;
  lastName: string;
  homeAddress: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  emergencyContact: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  passportNumber: string;
  arrivalDate: string;
  terminal: string;
  flightNumber: string;
  destinationFrom: string;
  arrivalTime: string;
  departureDate: string;
  agencyID: number;
  agentId: number;
  agencyRef: string;
  departureTerminal: string;
  departureFlightNumber: string;
  destinationTo: string;
  flightDepartureTime: string;
  [propNme: string]: any;
  active: boolean;
  medicalInformation: string;
  dietaryNeeds: string;
  allergies: string;
  medicalNotes: string;
  programeStartDate: string;
  programeEndDate: string;
  campus?: number;
  format: number;
  mealPlan: string;
  programeAddins: [];
  addinsID: string;
  extraNotes: string;
  extraNotesHTML: string;
  status: string;
  homestayOrResi: number;
  homestayID: number;
  roomID: number;
  roomSearchCampus: number;
  roomSearchFrom: string;
  roomSearchTo: string;
  numberOfNights: number;
  totalGrossPrice: number;
  totalAddins: number;
  paid: number;
  commision: number;
  commissionAddins: number;
  profilePic: string;
  netPrice: number;
  balance: number;
  studentTrips: [];
  studentTripsID: string;
  formatName: string;
  agentName: string;
  chapFamily: string;
  programID: number;
  subProgramID: number;
  documentPath: string;
}
export interface Trip {
  id: number;
  year: number;
  trips: string;
  camps: string;
  tripsDate: string;
  notes?: any;
  ldx?: string;
  active: boolean;
}
export interface LookupTable {
  value: number;
  name: string;
}
export interface ProgrameAddins {
  id: number;
  addins: string;
  camps: string;
  cost: number;
  addinsType: string;
  active: boolean;
}
export interface PaymentGroup {
  id: number;
  refNumber: string;
  groupId: number;
  date: string;
  amount: number;
  remarks: string;
  active: boolean;
}
export interface Campus {
  id: number;
  campus: string;
  camps: number;
  addressOnReports: string;
  completeName: number;
  onelineaddress: string;
  active: boolean;
}
export interface HomeStay {
  homeId: number;
  reference: string;
  name: number;
  cellNumber: string;
  email: string;
  address: string;
  region: string;
  intersection: string;
  distance: string;
  meals: string;
  prefer: string;
  rooms: string;
  aggrements: string;
  policeCheck: string;
  active: boolean;
}
export interface Program {
  id: number;
  programName: string;
  active: boolean;
  isDefault?: boolean;
}
export interface SubProgram {
  id: number;
  programID: number;
  programName: string;
  subProgramName: string;
  active: boolean;
}

export interface TripsMangerModel {
  id: number;
  grpRef: string;
  groupTrips: [];
}
export interface User {
  id: number;
  email: string;
  firstName: string;
  surName: string;
  streetAddress: string;
  company: string;
  suburb: string;
  state_Province: string;
  country: string;
  postalCode: string;
  password: string;
  phoneNumber: string;
  roleId: number;
}

export interface StudentDocuments {
  Files: any;
  FileName: string;
  FilePath: [];

}
