import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AGENTS_COL_DEFS } from '../../common/elicamps-column-definitions';
import { Agent } from '../../EliCamps-Models/Elicamps';
import { ListService } from '../../services/list.service';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
import { AllModules } from "@ag-grid-enterprise/all-modules";
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {
 public defaultColDef;

  public columnDefs = AGENTS_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public agentList: Agent[];
  public modules = AllModules;
  public gridColumnApi: any;
  constructor(public router: Router, public listService: ListService) {
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
  }
  public getAgentList = () => {
    const params = {
      active: true
    };
    this.listService.getAllAgent({}).subscribe(res => {
      this.agentList = (res as any).data;
      this.autoSizeAll(false);
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getAgentList();
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
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Agents')
  }
}
