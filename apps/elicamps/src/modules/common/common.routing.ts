import { Routes, RouterModule } from '@angular/router';
import { AppMasterGuard } from '../../guards/app-master.guard';
import { AgentsComponent } from './features/agents/agents.component';
import { GroupAddEditComponent } from '../registration/features/groups/group-add-edit/group-add-edit.component';
import { AgentAddEditComponent } from './features/agents/agent-add-edit/agent-add-edit.component';
import { CampusAddEditComponent } from './features/campus/campus-add-edit/campus-add-edit.component';
import { CampusComponent } from './features/campus/campus.component';
import { ConfigComponent } from './features/config/config.component';
import { AddEditHomestayComponent } from './features/home-stays/add-edit-homestay/add-edit-homestay.component';
import { HomeStaysComponent } from './features/home-stays/home-stays.component';
import { AddEditProgramComponent } from './features/program/add-edit-program/add-edit-program.component';
import { ProgramComponent } from './features/program/program.component';
import { AddEditSubProgramComponent } from './features/program/sub-program/add-edit-sub-program/add-edit-sub-program.component';
import { SubProgramComponent } from './features/program/sub-program/sub-program.component';
import { AddEditAddinsComponent } from './features/programe-addins/add-edit-addins/add-edit-addins.component';
import { ProgrameAddinsComponent } from './features/programe-addins/programe-addins.component';
import { RoomsAddEditComponent } from './features/rooms/rooms-add-edit/rooms-add-edit.component';
import { RoomsComponent } from './features/rooms/rooms.component';
import { TripAddEditComponent } from './features/trips/trip-add-edit/trip-add-edit.component';
import { TripsComponent } from './features/trips/trips.component';

const routes: Routes = [
  {
    path: 'agents',
    canActivate: [AppMasterGuard],
    component: AgentsComponent,
    data: { title: 'Agents' },
  },
  {
    path: 'homestays',
    canActivate: [AppMasterGuard],
    component: HomeStaysComponent,
    data: { title: 'Homestays' },
  },
  {
    path: 'rooms',
    canActivate: [AppMasterGuard],
    component: RoomsComponent,
    data: { title: 'Rooms' },
  },
  {
    path: 'trips',
    canActivate: [AppMasterGuard],
    component: TripsComponent,
    data: { title: 'Trips' },
  },
  {
    path: 'addTrip',
    canActivate: [AppMasterGuard],
    component: TripAddEditComponent,
    data: { title: 'Trip Form' },
  },
  {
    path: 'addGroup',
    canActivate: [AppMasterGuard],
    component: GroupAddEditComponent,
    data: { title: 'Group Form' },
  },
  {
    path: 'addAgent',
    canActivate: [AppMasterGuard],
    component: AgentAddEditComponent,
    data: { title: 'Agent Form' },
  },
  {
    path: 'addRoom',
    canActivate: [AppMasterGuard],
    component: RoomsAddEditComponent,
    data: { title: 'Room Form' },
  },
  {
    path: 'addins',
    canActivate: [AppMasterGuard],
    component: ProgrameAddinsComponent,
    data: { title: 'Addins' },
  },
  {
    path: 'addAddins',
    canActivate: [AppMasterGuard],
    component: AddEditAddinsComponent,
    data: { title: 'Addins Form' },
  },
  {
    path: 'campus',
    canActivate: [AppMasterGuard],
    component: CampusComponent,
    data: { title: 'Campus' },
  },
  {
    path: 'addCampus',
    canActivate: [AppMasterGuard],
    component: CampusAddEditComponent,
    data: { title: 'Campus Form' },
  },
  {
    path: 'addHomeStay',
    canActivate: [AppMasterGuard],
    component: AddEditHomestayComponent,
    data: { title: 'Homestay Form' },
  },
  {
    path: 'programs',
    canActivate: [AppMasterGuard],
    component: ProgramComponent,
    data: { title: 'Programs' },
  },
  {
    path: 'addProgram',
    canActivate: [AppMasterGuard],
    component: AddEditProgramComponent,
    data: { title: 'Program Form' },
  },
  {
    path: 'subPrograms',
    canActivate: [AppMasterGuard],
    component: SubProgramComponent,
    data: { title: 'Sub Programs' },
  },
  {
    path: 'addSubProgram',
    canActivate: [AppMasterGuard],
    component: AddEditSubProgramComponent,
    data: { title: 'Sub Program Form' },
  },
  {
    path: 'config',
    canActivate: [AppMasterGuard],
    component: ConfigComponent,
    data: { title: 'Config' },
  },
  
];

export const CommonRoutes = RouterModule.forChild(routes);
