import { Routes, RouterModule } from '@angular/router';
import { StudentReportComponent } from './features/student-report/student-report.component';
import { GroupReportComponent } from './features/student-report/group-report/group-report.component';
import { TripReportComponent } from './features/student-report/trip-report/trip-report.component';
import { HomestayReportComponent } from './features/student-report/homestay-report/homestay-report.component';
import { RoomAvailabilityComponent } from './features/student-report/room-availability/room-availability.component';
import { AirportTransferReportComponent } from './features/airport-transfer-report/airport-transfer-report.component';
import { InsuranceReportComponent } from './features/insurance-report/insurance-report.component';
import { PaymentReportComponent } from './features/student-report/payment-report/payment-report.component';
import { RoomsCheckInReportComponent } from './features/rooms-check-in-report/rooms-check-in-report.component';
import { BulkInvoiceComponent } from './features/bulk-invoice/bulk-invoice.component';
import { CheckInOutReportComponent } from './features/check-in-out-report/check-in-out-report.component';

const routes: Routes = [
  {
    path: 'site-report',
    component: StudentReportComponent,
    data: { title: 'Site By Date Report' },
  },
  {
    path: 'group-report',
    component: GroupReportComponent,
    data: { title: 'Groups Report' },
  },
  {
    path: 'trip-report',
    component: TripReportComponent,
    data: { title: 'Trips Report' },
  },
  {
    path: 'homestay-report',
    component: HomestayReportComponent,
    data: { title: 'Homestay Report' },
  },
  {
    path: 'payment-summary-report',
    component: PaymentReportComponent,
    data: { title: 'Payment Summary Report' },
  },
  {
    path: 'insurance-report',
    component: InsuranceReportComponent,
    data: { title: 'Insurance Report' },
  },
  {
    path: 'airport-report',
    component: AirportTransferReportComponent,
    data: { title: 'Airport Transfer Report' },
  },
  {
    path: 'rooms-availability',
    component: RoomAvailabilityComponent,
    data: { title: 'Rooms Availability' },
  },
  {
    path: 'rooms-check-in-report',
    component: RoomsCheckInReportComponent,
    data: { title: 'Room Check Date Report By Student' },
  },
  {
    path: 'bulk-invoice',
    component: BulkInvoiceComponent,
    data: { title: 'Send Email' },
  },
  { path: '', component: CheckInOutReportComponent, data: { title: 'Home' } },
];

export const AnalyticsRoutes = RouterModule.forChild(routes);
