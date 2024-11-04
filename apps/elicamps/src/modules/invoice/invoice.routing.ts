import { Routes, RouterModule } from '@angular/router';
import { AgentInvoiceComponent } from './features/agent-invoice/agent-invoice.component';
import { LoaInvoiceComponent } from './features/agent-invoice/loa-invoice/loa-invoice.component';
import { StudentAirportInvoiceComponent } from './features/agent-invoice/student-airport-invoice/student-airport-invoice.component';
import { GroupInvoiceComponent } from './features/group-invoice/group-invoice.component';
import { LoaGroupInvoiceComponent } from './features/loa-group-invoice/loa-group-invoice.component';
import { StudentCertificateComponent } from './features/student-certificate/student-certificate.component';
import { StudentInvitationComponent } from './features/student-invitation/student-invitation.component';
import { StudentLoaInvoiceComponent } from './features/student-loa-invoice/student-loa-invoice.component';

const routes: Routes = [
  { path: 'agent-invoice', component: AgentInvoiceComponent },
  {
    path: 'student-certificate',
    component: StudentCertificateComponent,
  },
  {
    path: 'student-invitation',
    component: StudentInvitationComponent,
  },
  {
    path: 'student-Loa',
    component: StudentLoaInvoiceComponent,
  },
  { path: 'loa-invoice', component: LoaInvoiceComponent },
  {
    path: 'student-Airport-Invoice',
    component: StudentAirportInvoiceComponent,
  },
  {
    path: 'loa-group-invoice',
    component: LoaGroupInvoiceComponent,
  },
  { path: 'group-invoice', component: GroupInvoiceComponent },
];

export const InvoiceRoutes = RouterModule.forChild(routes);
