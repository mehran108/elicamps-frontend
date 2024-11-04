/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { USER_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Keys } from 'apps/elicamps/src/common/lookup.enums';
import { User } from 'apps/elicamps/src/models/Elicamps';
import { AuthenticationService } from 'apps/elicamps/src/services/authentication.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  public columnDefs: any = USER_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public userList!: User[];
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
    this.user = localStorage.getItem(Keys.USER_INFO) ? JSON.parse(localStorage.getItem(Keys.USER_INFO)|| '') : null;
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
  onGridReady(params: any) {
    this.gridApi = params.api;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellClicked($event: any) {

    this.router.navigate(['addAgent'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
