import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { SharedModule } from '../shared/shared.module';
import { InvoiceRoutes } from './invoice.routing';
import { AgentInvoiceComponent } from './features/agent-invoice/agent-invoice.component';
import { StudentCertificateComponent } from './features/student-certificate/student-certificate.component';
import { StudentInvitationComponent } from './features/student-invitation/student-invitation.component';
import { StudentLoaInvoiceComponent } from './features/student-loa-invoice/student-loa-invoice.component';
import { LoaInvoiceComponent } from './features/agent-invoice/loa-invoice/loa-invoice.component';
import { StudentAirportInvoiceComponent } from './features/agent-invoice/student-airport-invoice/student-airport-invoice.component';
import { GroupInvoiceComponent } from './features/group-invoice/group-invoice.component';
import { LoaGroupInvoiceComponent } from './features/loa-group-invoice/loa-group-invoice.component';

@NgModule({
  imports: [CommonModule, SharedModule, InvoiceRoutes],
  declarations: [
    InvoiceComponent,
    AgentInvoiceComponent,
    StudentCertificateComponent,
    StudentInvitationComponent,
    StudentLoaInvoiceComponent,
    LoaInvoiceComponent,
    StudentAirportInvoiceComponent,
    GroupInvoiceComponent,
    LoaGroupInvoiceComponent
  ],
})
export class InvoiceModule {}
