/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { GROUPS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { GroupService } from 'apps/elicamps/src/services/group.service';

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.css']
})
export class GroupReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs: any = GROUPS_COL_DEFS;
  public gridOptions: any;
  public info: any;
  private gridApi: any;
  public groups: any;
  public startDate: any;
  public endDate: any;
  constructor(public router: Router, public groupService: GroupService) {
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
  }
  ngOnInit() {
    this.getAgentList();
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.groupService.getAllElicampsGroups(params).subscribe(res => {
      this.groups = (res as any).data;
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
