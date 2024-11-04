import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { SharedModule } from '../shared/shared.module';
import { RegistrationRoutes } from './registration.routing';
import { GroupAddEditComponent } from './features/groups/group-add-edit/group-add-edit.component';
import { AddPaymentComponent } from './features/groups/group-add-edit/group-payment/add-payment/add-payment.component';
import { GroupPaymentComponent } from './features/groups/group-add-edit/group-payment/group-payment.component';
import { GroupProgrameComponent } from './features/groups/group-add-edit/group-programe/group-programe.component';
import { GroupsComponent } from './features/groups/groups.component';
import { AccomodationComponent } from './features/students/student-registration/accomodation/accomodation.component';
import { FlightInformationComponent } from './features/students/student-registration/flight-information/flight-information.component';
import { MedicalInformationComponent } from './features/students/student-registration/medical-information/medical-information.component';
import { PaymentInformationComponent } from './features/students/student-registration/payment-information/payment-information.component';
import { ProgramInformationComponent } from './features/students/student-registration/program-information/program-information.component';
import { StudentInformationComponent } from './features/students/student-registration/student-information/student-information.component';
import { StudentRegistrationComponent } from './features/students/student-registration/student-registration.component';
import { StudentsComponent } from './features/students/students.component';
import { StudentRegistrationWrapperComponent } from './features/students/student-registration/student-registration-wrapper/student-registration.component-wrapper';
import { StudentStatusComponent } from './features/student-status/student-status.component';
import { StudentPaymentComponent } from './features/students/student-registration/payment-information/student-payment/student-payment.component';
import { FileManagerComponent } from './features/students/student-registration/file-manager/file-manager.component';
import { TripManagerComponent } from '../registration/features/groups/group-add-edit/trip-manager/trip-manager.component';
import { NotesComponent } from '../registration/features/students/student-registration/notes/notes.component';
import { TripsManagerComponent } from '../registration/features/students/student-registration/trips-manager/trips-manager.component';
@NgModule({
  imports: [CommonModule, SharedModule, RegistrationRoutes],
  declarations: [
    RegistrationComponent,
    GroupsComponent,
    GroupAddEditComponent,
    GroupPaymentComponent,
    AddPaymentComponent,
    GroupProgrameComponent,
    StudentRegistrationComponent,
    StudentsComponent,
    StudentInformationComponent,
    FlightInformationComponent,
    MedicalInformationComponent,
    ProgramInformationComponent,
    AccomodationComponent,
    PaymentInformationComponent,
    StudentRegistrationWrapperComponent,
    StudentStatusComponent,
    StudentPaymentComponent,
    FileManagerComponent,
    NotesComponent,
    TripsManagerComponent,
    TripManagerComponent
  ],
})
export class RegistrationModule {}
