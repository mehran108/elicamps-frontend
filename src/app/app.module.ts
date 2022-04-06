import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from '@ag-grid-community/angular';
import { MaterialModule } from 'src/modules/material/material.module';
import { AppRoutingModule } from 'src/modules/routing/routing.module';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AgentsComponent } from 'src/EliCamps/components/agents/agents.component';
import { AgentAddEditComponent } from 'src/EliCamps/components/agents/agent-add-edit/agent-add-edit.component';
import { AddPaymentComponent } from 'src/EliCamps/components/groups/group-add-edit/group-payment/add-payment/add-payment.component';
import { GroupProgrameComponent } from 'src/EliCamps/components/groups/group-add-edit/group-programe/group-programe.component';
import { TripManagerComponent } from 'src/EliCamps/components/groups/group-add-edit/trip-manager/trip-manager.component';
import { HomeStaysComponent } from 'src/EliCamps/components/home-stays/home-stays.component';
import { AddEditHomestayComponent } from 'src/EliCamps/components/home-stays/add-edit-homestay/add-edit-homestay.component';
import { ProgrameAddinsComponent } from 'src/EliCamps/components/programe-addins/programe-addins.component';
import { AddEditAddinsComponent } from 'src/EliCamps/components/programe-addins/add-edit-addins/add-edit-addins.component';
import { RoomsComponent } from 'src/EliCamps/components/rooms/rooms.component';
import { RoomsAddEditComponent } from 'src/EliCamps/components/rooms/rooms-add-edit/rooms-add-edit.component';
import { TripsComponent } from 'src/EliCamps/components/trips/trips.component';
import { CampusComponent } from 'src/EliCamps/components/campus/campus.component';
import { CampusAddEditComponent } from 'src/EliCamps/components/campus/campus-add-edit/campus-add-edit.component';
import { GroupsComponent } from 'src/EliCamps/components/groups/groups.component';
import { GroupAddEditComponent } from 'src/EliCamps/components/groups/group-add-edit/group-add-edit.component';
import { GroupPaymentComponent } from 'src/EliCamps/components/groups/group-add-edit/group-payment/group-payment.component';
import { LayoutComponent } from 'src/EliCamps/components/layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from 'src/EliCamps/components/login/login.component';
import { StudentRegistrationComponent } from 'src/EliCamps/components/students/student-registration/student-registration.component';
import { StudentsComponent } from 'src/EliCamps/components/students/students.component';
import { ForgetPasswordComponent } from 'src/EliCamps/components/login/forget-password/forget-password.component';
// tslint:disable-next-line: max-line-length
import { StudentInformationComponent } from 'src/EliCamps/components/students/student-registration/student-information/student-information.component';
// tslint:disable-next-line: max-line-length
import { FlightInformationComponent } from 'src/EliCamps/components/students/student-registration/flight-information/flight-information.component';
// tslint:disable-next-line: max-line-length
import { MedicalInformationComponent } from 'src/EliCamps/components/students/student-registration/medical-information/medical-information.component';
// tslint:disable-next-line: max-line-length
import { ProgramInformationComponent } from 'src/EliCamps/components/students/student-registration/program-information/program-information.component';
import { AccomodationComponent } from 'src/EliCamps/components/students/student-registration/accomodation/accomodation.component';
// tslint:disable-next-line: max-line-length
import { PaymentInformationComponent } from 'src/EliCamps/components/students/student-registration/payment-information/payment-information.component';
import { FileManagerComponent } from 'src/EliCamps/components/students/student-registration/file-manager/file-manager.component';
import { TripsManagerComponent } from 'src/EliCamps/components/students/student-registration/trips-manager/trips-manager.component';
import { NotesComponent } from 'src/EliCamps/components/students/student-registration/notes/notes.component';
import { ProgramComponent } from 'src/EliCamps/components/program/program.component';
import { AddEditProgramComponent } from 'src/EliCamps/components/program/add-edit-program/add-edit-program.component';
import { SubProgramComponent } from 'src/EliCamps/components/program/sub-program/sub-program.component';
// tslint:disable-next-line: max-line-length
import { AddEditSubProgramComponent } from 'src/EliCamps/components/program/sub-program/add-edit-sub-program/add-edit-sub-program.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SafeHTML } from 'src/EliCamps/pipes/safeHTML';
import { StudentReportComponent } from 'src/EliCamps/components/Reports/student-report/student-report.component';
import { GroupReportComponent } from 'src/EliCamps/components/Reports/student-report/group-report/group-report.component';
import { TripReportComponent } from 'src/EliCamps/components/Reports/student-report/trip-report/trip-report.component';
import { HomestayReportComponent } from 'src/EliCamps/components/Reports/student-report/homestay-report/homestay-report.component';
import { AgentInvoiceComponent } from 'src/EliCamps/components/Invoices/agent-invoice/agent-invoice.component';
import { StudentCertificateComponent } from 'src/EliCamps/components/Invoices/student-certificate/student-certificate.component';
import { StudentInvitationComponent } from 'src/EliCamps/components/Invoices/student-invitation/student-invitation.component';
import { StudentLoaInvoiceComponent } from 'src/EliCamps/components/Invoices/student-loa-invoice/student-loa-invoice.component';
import { UsersComponent } from 'src/EliCamps/components/users/users.component';
import { LoaInvoiceComponent } from 'src/EliCamps/components/Invoices/agent-invoice/loa-invoice/loa-invoice.component';
// tslint:disable-next-line: max-line-length
import { StudentAirportInvoiceComponent } from 'src/EliCamps/components/Invoices/agent-invoice/student-airport-invoice/student-airport-invoice.component';
import { TripAddEditComponent } from 'src/EliCamps/components/trips/trip-add-edit/trip-add-edit.component';
import { GroupInvoiceComponent } from 'src/EliCamps/components/Invoices/group-invoice/group-invoice.component';
// tslint:disable-next-line: max-line-length
import { ConfirmationDialogComponent } from 'src/EliCamps/components/students/student-registration/confirmation-dialog/confirmation-dialog.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoaGroupInvoiceComponent } from 'src/EliCamps/components/Invoices/loa-group-invoice/loa-group-invoice.component';
import { StudentPaymentComponent } from 'src/EliCamps/components/students/student-registration/payment-information/student-payment/student-payment.component';
import { ButtonRendererComponent } from 'src/EliCamps/ag-grid/renderers/button-renderer.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteConfirmationDialogComponent } from 'src/EliCamps/components/confirmation-dialog/delete-confirmation-dialog.component';
import { PaymentReportComponent } from 'src/EliCamps/components/Reports/student-report/payment-report/payment-report.component';
import { InsuranceReportComponent } from 'src/EliCamps/components/Reports/insurance-report/insurance-report.component';
import { AirportTransferReportComponent } from 'src/EliCamps/components/Reports/airport-transfer-report/airport-transfer-report.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ConfigComponent } from 'src/EliCamps/components/config/config.component';
import { StudentRegistrationWrapperComponent } from 'src/EliCamps/components/students/student-registration/student-registration-wrapper/student-registration.component-wrapper';
import { CheckInOutReportComponent } from 'src/EliCamps/components/Reports/check-in-out-report/check-in-out-report.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RoomAvailabilityComponent } from 'src/EliCamps/components/Reports/student-report/room-availability/room-availability.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHTML,
    ChipRendererComponent,
    AgentsComponent,
    AgentAddEditComponent,
    CampusComponent,
    CampusAddEditComponent,
    GroupsComponent,
    GroupAddEditComponent,
    GroupPaymentComponent,
    AddPaymentComponent,
    GroupProgrameComponent,
    TripManagerComponent,
    HomeStaysComponent,
    AddEditHomestayComponent,
    ProgrameAddinsComponent,
    AddEditAddinsComponent,
    RoomsComponent,
    RoomsAddEditComponent,
    TripsComponent,
    LayoutComponent,
    LoginComponent,
    StudentRegistrationComponent,
    StudentsComponent,
    ForgetPasswordComponent,
    StudentInformationComponent,
    FlightInformationComponent,
    MedicalInformationComponent,
    ProgramInformationComponent,
    AccomodationComponent,
    PaymentInformationComponent,
    FileManagerComponent,
    TripsManagerComponent,
    NotesComponent,
    ProgramComponent,
    AddEditProgramComponent,
    SubProgramComponent,
    AddEditSubProgramComponent,
    StudentReportComponent,
    GroupReportComponent,
    TripReportComponent,
    HomestayReportComponent,
    AgentInvoiceComponent,
    StudentCertificateComponent,
    StudentInvitationComponent,
    StudentLoaInvoiceComponent,
    UsersComponent,
    LoaInvoiceComponent,
    StudentAirportInvoiceComponent,
    TripAddEditComponent,
    GroupInvoiceComponent,
    ConfirmationDialogComponent,
    LoaGroupInvoiceComponent,
    StudentPaymentComponent,
    ButtonRendererComponent,
    DeleteConfirmationDialogComponent,
    PaymentReportComponent,
    InsuranceReportComponent,
    AirportTransferReportComponent,
    ConfigComponent,
    StudentRegistrationWrapperComponent,
    CheckInOutReportComponent,
    RoomAvailabilityComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AgGridModule.withComponents([ChipRendererComponent, ButtonRendererComponent]),
    AgGridModule.forRoot(),
    DateInputsModule,
    HttpClientModule,
    CKEditorModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })

  ],
  entryComponents: [
    ConfirmationDialogComponent,
    AddPaymentComponent,
    ChipRendererComponent,
    TripManagerComponent,
    GroupPaymentComponent,
    GroupProgrameComponent,
    StudentPaymentComponent,
    ButtonRendererComponent,
    DeleteConfirmationDialogComponent
  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
  bootstrap: [AppComponent]
})
export class AppModule { }
