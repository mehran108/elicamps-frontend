import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ListService } from "../../../services/list.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-measurement-form",
  templateUrl: "./measurement-form.component.html",
})
export class MeasurementFormComponent implements OnInit {
  public defaultColDef;

  public registerForm: FormGroup;
  public isPhoneNumberValid = true;
  public submitted = false;
  public phoneNumberRegex = /^([0-9]){9}$/;
  public CustomerList: Array<any> = [];
  public emailMaxChars = 50;
  public id: number;
  public isEdit = false;
  public SelectedCustomerMeasurement: any;
  public loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public listService: ListService,
    public location: Location
  ) {}
  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm;
  }
  ngOnInit() {
    this.getParams();
    this.initializeDropDowns();
    this.initializeForm();
  }
  public getParams() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        this.id = Number(atob(params.id));
        if (this.id) {
          this.isEdit = true;
          this.getSelectedCustomerMeasurement(this.id);
        }
      }
    });
  }
  public getSelectedCustomerMeasurement = (id: number) => {
    this.listService.GetCustomerMeasurementById(id).subscribe(res => {
      if (res) {
        this.SelectedCustomerMeasurement = res;
        this.populateForm(this.SelectedCustomerMeasurement);
      }
    });
  };
  public populateForm = (Customer: any) => {
    Object.keys(this.f.controls).forEach((key) => {
      if (key) {
        if (Customer[key]) {
          this.f.controls[key].setValue(Customer[key]);
        }
      }
    });
  };
  public initializeDropDowns = () => {
    this.listService.GetCustomers({}).subscribe((res: Array<any>) => {
      this.CustomerList = res;
    });
  };
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      id: [],
      customerId: [],
      shirtChest: [],
      shirtWaist: [],
      shoulder: [],
      sleeves: [],
      neck: [],
      shalwarLength: [],
      shalwarBottom: [],
      ghera: [],
      asan: [],
      coatLength: [],
      crossBack: [],
      halfBack: [],
      pentLength: [],
      pentWaist: [],
      hip: [],
      knee: [],
      pentBottom: [],
      inside: [],
      thai: [],
    });
  }

  Cancel_Click() {
    this.router.navigate(["/measurement"]);
  }
  onPhoneNumberChanged = () => {
    const value = this.registerForm.controls["phone"].value;
    this.isPhoneNumberValid = value.match(this.phoneNumberRegex);
  };
  onSubmit() {
    this.submitted = true;
    if (this.f.valid) {
      this.loading = true;
      const model = {
        ...this.f.value
      };
      if (this.isEdit) {
        this.listService.UpdateCustomerMeasurement(model).subscribe(res => {
          this.router.navigate(['/measurement']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      } else {
        delete model.id;
        this.listService.AddCustomerMeasurement(model).subscribe(res => {
          this.router.navigate(['/measurement']);
          this.loading = false;
        }, error => {
          this.loading = false;
        });
      }
    }
  }
}
