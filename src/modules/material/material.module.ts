import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule, MatIconModule, MatSidenavModule,
  MatListModule, MatButtonModule, MatCheckboxModule,
  MatDialogModule, MatFormFieldModule, MatInputModule,
  MatTooltipModule, MatAutocompleteModule, MatStepperModule,
  MatProgressBarModule, MatRadioModule, MatDatepickerModule,
  MatNativeDateModule, MatSelectModule, MatGridListModule,
  MatExpansionModule, MatTabsModule, MatChipsModule, MatSlideToggleModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from 'ngx-loading';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileManagerAllModule } from '@syncfusion/ej2-angular-filemanager';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import {MatMenuModule} from '@angular/material/menu';
import { ToastrModule } from 'ngx-toastr';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    NgxLoadingModule.forRoot({}),
    DateInputsModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatMenuModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    FileManagerAllModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    FormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    NgxLoadingModule,
    DateInputsModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatMenuModule,
    FlexLayoutModule,
    ToastrModule,
    FileManagerAllModule
  ],
  providers: [
      {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
      }
  ],
  declarations: []
})
export class MaterialModule { }
