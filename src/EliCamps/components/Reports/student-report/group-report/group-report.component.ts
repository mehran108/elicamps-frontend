import { Component, OnInit } from '@angular/core';
import { GROUPS_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { Group } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { GroupService } from 'src/EliCamps/services/group.service';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-group-report',
  templateUrl: './group-report.component.html',
  styleUrls: ['./group-report.component.css']
})
export class GroupReportComponent implements OnInit {
 public defaultColDef;

  public columnDefs = GROUPS_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public groups: Group[];
  public modules = AllModules;
  public startDate: string;
  public endDate: string;
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
  public dateChange = () => {
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
