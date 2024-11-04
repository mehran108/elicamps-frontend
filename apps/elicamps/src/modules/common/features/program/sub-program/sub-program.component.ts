/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { SUB_PROGRAM_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { SubProgram } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-sub-program',
  templateUrl: './sub-program.component.html',
  styleUrls: ['./sub-program.component.css']
})
export class SubProgramComponent implements OnInit {

  public columnDefs: any = SUB_PROGRAM_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public subProgramList!: SubProgram[];
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
  onGridReady(params: any) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'SubProgram')

  }
  onCellClicked($event: any) {

    this.router.navigate(['addSubProgram'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
