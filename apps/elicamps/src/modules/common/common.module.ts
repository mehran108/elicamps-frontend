import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { CommonComponent } from './common.component';
import { SharedModule } from '../shared/shared.module';
import { CommonRoutes } from './common.routing';
import { AgentAddEditComponent } from './features/agents/agent-add-edit/agent-add-edit.component';
import { AgentsComponent } from './features/agents/agents.component';
import { CampusAddEditComponent } from './features/campus/campus-add-edit/campus-add-edit.component';
import { CampusComponent } from './features/campus/campus.component';
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
import { ConfigComponent } from './features/config/config.component';

@NgModule({
  imports: [AngularCommonModule, SharedModule, CommonRoutes],
  declarations: [
    CommonComponent,
    AgentsComponent,
    AgentAddEditComponent,
    CampusComponent,
    CampusAddEditComponent,
    HomeStaysComponent,
    AddEditHomestayComponent,
    ProgrameAddinsComponent,
    AddEditAddinsComponent,
    RoomsComponent,
    RoomsAddEditComponent,
    TripsComponent,
    ProgramComponent,
    AddEditProgramComponent,
    SubProgramComponent,
    AddEditSubProgramComponent,
    TripAddEditComponent,
    ConfigComponent
  ],
})
export class CommonModule {}
