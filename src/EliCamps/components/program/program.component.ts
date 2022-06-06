import { Component, OnInit } from '@angular/core';
import { Program } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { PROGRAM_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ListService } from 'src/EliCamps/services/list.service';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {

  public columnDefs = PROGRAM_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public programList: Program[];
  public modules = AllModules;
  public gridColumnApi: any;
  public defaultColDef;
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
    this.getProgramList();
  }

  public getProgramList = () => {
    const params = {
      active: true
    };
    this.listService.getAllProgram(params).subscribe(res => {
      this.programList = (res as any).data;
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Program')
  }
  onCellClicked($event) {

    this.router.navigate(['addProgram'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });
  }
}
