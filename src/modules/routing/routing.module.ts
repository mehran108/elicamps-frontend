import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "../login/login.component";
import { ForgetPasswordComponent } from "../login/forget-password/forget-password.component";
import { LayoutComponent } from "../layout/layout.component";
import { CustomerComponent } from "../customer/customer.component";
import { CustomerFormComponent } from "../customer/customer-form/customer-form.component";
import { MeasurementComponent } from "../measurement/measurement.component";
import { MeasurementFormComponent } from "../measurement/measurement-form/measurement-form.component";
import { OrderComponent } from "../order/order.component";
import { OrderFormComponent } from "../order/order-form/order-form.component";
const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "forgetPassword", component: ForgetPasswordComponent },
  {
    path: "",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "", component: CustomerComponent },
      { path: "customer/form", component: CustomerFormComponent },
      { path: "measurement", component: MeasurementComponent },
      { path: "measurement/form", component: MeasurementFormComponent },
      { path: "order", component: OrderComponent },
      { path: "order/form", component: OrderFormComponent },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" }),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
