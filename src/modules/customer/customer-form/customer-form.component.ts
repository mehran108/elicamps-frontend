import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListService } from '../../../services/list.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {
 public defaultColDef;


  public registerForm: FormGroup;
  public isPhoneNumberValid = true;
  public submitted = false;
  public phoneNumberRegex = /^([0-9]){9}$/;
  public CustomerList: Array<any> = [];
  public emailMaxChars = 50;
  public id: number;
  public isEdit = false;
  public selectedCustomer: any;
  public loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location,
    public taost: ToastrService
  ) {
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm; }
  ngOnInit() {
    this.getParams();
    this.initializeDropDowns();
    this.initializeForm();
  }
  public getParams() {
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedCustomer(this.id);
        }
      }
    });
  }
  public getSelectedCustomer = (id: number) => {
    this.listService.GetCustomerById(id).subscribe(res => {
      if (res) {
        this.selectedCustomer = res;
        this.populateForm(this.selectedCustomer);
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
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [],
      name: [''],
      address: [''],
      phoneNumber: [''],
      email: [''],
      active: [true]
    });
  }

  Cancel_Click() {
    this.router.navigate(['']);
  }
  onPhoneNumberChanged = () => {
    const value = this.registerForm.controls['phoneNumber'].value;
    this.isPhoneNumberValid = value.match(this.phoneNumberRegex);
  }
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      const model = {
        ...this.f.value,
       id: this.f.controls.id.value,
      };
      if (this.isEdit) {
        this.listService.UpdateCustomer(model).subscribe(res => {
          this.taost.success('Customer updated successfully!', 'Customer')
          this.router.navigate(['']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      } else {
        delete model.id;
        this.listService.AddCustomer(model).subscribe(res => {
          this.taost.success('Customer added successfully!', 'Customer')
          this.router.navigate(['']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      }
    }
  }

}
