import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { SafeHTML } from '../../pipes/safeHTML';
import { ChipRendererComponent } from '../../ag-grid/renderers/chip-renderer/chip-renderer.component';
import { DeleteConfirmationDialogComponent } from '../common/features/confirmation-dialog/delete-confirmation-dialog.component';
import { ButtonRendererComponent } from '../../ag-grid/renderers/button-renderer.component';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    MultiSelectModule,
    MaterialModule,
    ToastrModule,
    NgxSpinnerModule,
    DropdownModule,
    SidebarModule,
    MenubarModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule
  ],
  declarations: [
    SafeHTML,
    ChipRendererComponent,
    ButtonRendererComponent,
    DeleteConfirmationDialogComponent
  ],
  exports: [
    SafeHTML,
    ChipRendererComponent,
    AgGridModule,
    MultiSelectModule,
    MaterialModule,
    ToastrModule,
    NgxSpinnerModule,
    DropdownModule,
    SidebarModule,
    MenubarModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule
  ]
})
export class SharedModule { }
