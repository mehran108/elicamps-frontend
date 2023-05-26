import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
 public defaultColDef;


  public registerForm: FormGroup;
  public isPhoneNumberValid = true;
  public submitted = false;
  public phoneNumberRegex = /^([0-9]){9}$/;
  public CustomerList: Array<any> = [];
  public emailMaxChars = 50;
  public id: number;
  public isEdit = false;
  public selectedOrder: any;
  public loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public toast: ToastrService
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm; }
  ngOnInit() {
    this.getParams();
    this.initializeDropDowns();
    this.initializeForm();
    this.f.controls.total.valueChanges.subscribe(res => this.calculateBalance())
    this.f.controls.advance.valueChanges.subscribe(res => this.calculateBalance())
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedOrder(this.id);
        }
      }
    });
  }
  public getSelectedOrder = (id: number) => {
    this.listService.GetOrderById(id).subscribe(res => {
      if (res) {
        this.selectedOrder = res;
        this.selectedOrder.deliveryDate = this.selectedOrder.deliveryDate ? new Date(this.selectedOrder.deliveryDate): null;
        this.populateForm(this.selectedOrder);
      }

    });
  }
  public populateForm = (Customer: any) => {
    Object.keys(this.f.controls).forEach(key => {
      if (key) {
        if (Customer[key]) {
          this.f.controls[key].setValue(Customer[key]);
        }
      }
    });
  }
  public initializeDropDowns = () => {
    this.listService.GetCustomers({}).subscribe((res: Array<any>) => {
      this.CustomerList = res;
    });
  };
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [],
      customerId: [0],
      suitQuantity: [0],
      createdDate: [null],
      total: [0],
      advance: [0],
      balance: [0],
      deliveryDate: [null],
      active: [true]
    });
  }

  Cancel_Click() {
    this.router.navigate(['/Customers']);
  }
  onPhoneNumberChanged = () => {
    const value = this.registerForm.controls['phone'].value;
    this.isPhoneNumberValid = value.match(this.phoneNumberRegex);
  }
  calculateBalance() {
   let balance = this.registerForm.controls['total'].value - this.registerForm.controls['advance'].value;
   balance ? this.registerForm.controls['balance'].setValue(balance): this.registerForm.controls['balance'].setValue(0);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      const model = {
        ...this.f.value
      };
      if (this.isEdit) {
        this.listService.UpdateOrder(model).subscribe(res => {
          this.toast.success('Order updated successfully!', 'Order')
          this.router.navigate(['/order']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      } else {
        delete model.id;
        this.listService.AddOrder(model).subscribe(res => {
          this.toast.success('Order updated successfully!', 'Order')
          this.router.navigate(['/order']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      }
    }
  }

}
