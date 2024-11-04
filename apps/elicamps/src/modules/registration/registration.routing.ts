import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './features/groups/groups.component';
import { StudentRegistrationWrapperComponent } from './features/students/student-registration/student-registration-wrapper/student-registration.component-wrapper';
import { StudentsComponent } from './features/students/students.component';
import { GroupAddEditComponent } from './features/groups/group-add-edit/group-add-edit.component';
import { GroupProgrameComponent } from './features/groups/group-add-edit/group-programe/group-programe.component';
import { GroupPaymentComponent } from './features/groups/group-add-edit/group-payment/group-payment.component';
import { StudentStatusComponent } from './features/student-status/student-status.component';

const routes: Routes = [
  {
    path: 'groups',
    component: GroupsComponent,
    data: { title: 'Eli Groups' },
  },
  {
    path: 'addGroup',
    component: GroupAddEditComponent,
    data: { title: 'Group Form' },
  },
  {
    path: 'students',
    component: StudentsComponent,
    data: { title: 'Eli Individual' },
  },
  {
    path: 'registerStudent',
    component: StudentRegistrationWrapperComponent,
    data: { title: 'Register Student' },
  },
  {
    path: 'group-payment',
    component: GroupPaymentComponent,
    data: { title: 'Group Payment' },
  },
  {
    path: 'group-program',
    component: GroupProgrameComponent,
    data: { title: 'Group Program' },
  },
  {
    path: 'student-status',
    component: StudentStatusComponent,
    data: { title: 'Student Status' },
  },
];

export const RegistrationRoutes = RouterModule.forChild(routes);
