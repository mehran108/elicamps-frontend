import { Component, OnInit } from '@angular/core';
import { SUB_PROGRAM_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { SubProgram } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ListService } from 'src/EliCamps/services/list.service';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-sub-program',
  templateUrl: './sub-program.component.html',
  styleUrls: ['./sub-program.component.css']
})
export class SubProgramComponent implements OnInit {

  public columnDefs = SUB_PROGRAM_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public subProgramList: SubProgram[];
  public modules = AllModules;
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
    this.getSubProgramList();
  }
  public getSubProgramList = () => {
    const params = {
      active: true
    };
    this.listService.getAllSubProgram(params).subscribe(res => {
      this.subProgramList = (res as any).data;
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'SubProgram')

  }
  onCellClicked($event) {

    this.router.navigate(['addSubProgram'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
