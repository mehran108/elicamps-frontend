import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { AuthenticationService } from 'src/services/authentication.service';
import { ChipRendererComponent } from 'src/common/ag-grid/renderers/chip-renderer/chip-renderer.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  public columnDefs = [];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public userList = [];
  public modules = AllModules;
  public user: any;
  public defaultColDef;
  constructor(public router: Router, public userService: AuthenticationService) {
        this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
    // this.user = localStorage.getItem(Keys.USER_INFO) ? JSON.parse(localStorage.getItem(Keys.USER_INFO)) : null;
  }
  ngOnInit() {
    this.getAgentList();
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.userService.getAll().subscribe(res => {
      this.userList = (res as any).data;
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellClicked($event) {

    this.router.navigate(['addAgent'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
