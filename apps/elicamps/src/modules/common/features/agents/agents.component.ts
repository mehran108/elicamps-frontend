/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AGENTS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { Agent } from 'http';
@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
})
export class AgentsComponent {
  public defaultColDef;

  public columnDefs: any = AGENTS_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public agentList!: Agent[];
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
  public getAgentList = () => {
    const params = {
      active: true,
    };
    this.listService.getAllAgent({}).subscribe((res) => {
      this.agentList = (res as any).data;
      this.autoSizeAll(false);
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  };
  autoSizeAll(skipHeader: any) {
    const allColumnIds: any = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getAgentList();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event: any) {
    this.router.navigate(['addAgent'], {
      queryParams: {
        id: btoa($event.data.id),
      },
    });
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Agents');
  }
}
