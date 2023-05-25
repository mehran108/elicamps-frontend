import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/modules/material/material.module';
import { AppRoutingModule } from 'src/modules/routing/routing.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, LocationStrategy, HashLocationStrategy } from '@angular/common';
// tslint:disable-next-line: max-line-length
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SafeHTML } from 'src/pipes/safeHTML';
import { ChipRendererComponent } from 'src/common/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { LayoutComponent } from 'src/modules/layout/layout.component';
import { LoginComponent } from 'src/modules/login/login.component';
import { ForgetPasswordComponent } from 'src/modules/login/forget-password/forget-password.component';
import { UsersComponent } from 'src/modules/users/users.component';
import { ButtonRendererComponent } from 'src/common/ag-grid/renderers/button-renderer.component';
import { DeleteConfirmationDialogComponent } from 'src/common/confirmation-dialog/delete-confirmation-dialog.component';
import { CustomerComponent } from 'src/modules/customer/customer.component';
import { CustomerFormComponent } from 'src/modules/customer/customer-form/customer-form.component';
import { MeasurementComponent } from 'src/modules/measurement/measurement.component';
import { MeasurementFormComponent } from 'src/modules/measurement/measurement-form/measurement-form.component';
import { OrderComponent } from 'src/modules/order/order.component';
import { OrderFormComponent } from 'src/modules/order/order-form/order-form.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeHTML,
    ChipRendererComponent,
    LayoutComponent,
    LoginComponent,
    ForgetPasswordComponent,
    UsersComponent,
    ButtonRendererComponent,
    DeleteConfirmationDialogComponent,
    CustomerComponent,
    CustomerFormComponent,
    MeasurementComponent,
    MeasurementFormComponent,
    OrderComponent,
    OrderFormComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AgGridModule,
    HttpClientModule,
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
    ChipRendererComponent,
    ButtonRendererComponent,
    DeleteConfirmationDialogComponent
  ],
  providers: [
    DatePipe,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }],
  bootstrap: [AppComponent]
})
export class AppModule { }
