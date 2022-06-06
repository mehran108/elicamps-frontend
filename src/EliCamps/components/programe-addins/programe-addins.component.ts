import { Component, OnInit } from '@angular/core';
import { ADDINS_COL_DEFS } from '../../common/elicamps-column-definitions';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { ProgrameAddins } from '../../EliCamps-Models/Elicamps';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { Location } from '@angular/common';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-programe-addins',
  templateUrl: './programe-addins.component.html',
  styleUrls: ['./programe-addins.component.css']
})
export class ProgrameAddinsComponent implements OnInit {

  public columnDefs = ADDINS_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public addinList: ProgrameAddins[];
  public modules = AllModules;
  public gridColumnApi: any;
   public defaultColDef;
  constructor(public router: Router, public listService: ListService, public location: Location
  ) {
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
    this.listService.getAllAddins(params).subscribe(res => {
      this.addinList = (res as any).data;
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'ProgramAddins')

  }
  onCellClicked($event) {

    this.router.navigate(['/addAddins'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
