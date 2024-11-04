import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsRoutes } from './analytics.routing';
import { GroupReportComponent } from './features/student-report/group-report/group-report.component';
import { HomestayReportComponent } from './features/student-report/homestay-report/homestay-report.component';
import { StudentReportComponent } from './features/student-report/student-report.component';
import { TripReportComponent } from './features/student-report/trip-report/trip-report.component';
import { AirportTransferReportComponent } from './features/airport-transfer-report/airport-transfer-report.component';
import { InsuranceReportComponent } from './features/insurance-report/insurance-report.component';
import { PaymentReportComponent } from './features/student-report/payment-report/payment-report.component';
import { CheckInOutReportComponent } from './features/check-in-out-report/check-in-out-report.component';
import { RoomAvailabilityComponent } from './features/student-report/room-availability/room-availability.component';
import { RoomsCheckInReportComponent } from './features/rooms-check-in-report/rooms-check-in-report.component';
import { BulkInvoiceComponent } from './features/bulk-invoice/bulk-invoice.component';

@NgModule({
  imports: [CommonModule, SharedModule, AnalyticsRoutes],
  declarations: [
    AnalyticsComponent,
    StudentReportComponent,
    GroupReportComponent,
    TripReportComponent,
    HomestayReportComponent,
    PaymentReportComponent,
    InsuranceReportComponent,
    AirportTransferReportComponent,
    CheckInOutReportComponent,
    RoomAvailabilityComponent,
    RoomsCheckInReportComponent,
    BulkInvoiceComponent
  ],
})
export class AnalyticsModule {}
