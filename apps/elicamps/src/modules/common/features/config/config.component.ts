/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { LookupEnum, Keys } from 'apps/elicamps/src/common/lookup.enums';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { LocalstorageService } from 'apps/elicamps/src/services/localstorage.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
 public defaultColDef;

  public columnDefs: any = [
    {
    name: 'Name',
    field: 'name',
    width: 300
  },
    {
    name: 'Value',
    field: 'description',
    editable: true
  },
];
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public configList: any;;
  public gridColumnApi: any;
  constructor(public router: Router, public listService: ListService, public storage: LocalstorageService) {
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
  public getConfigList = () => {
    this.listService.getAll(LookupEnum.CONFIG).subscribe(res => {
      this.configList = res;
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getConfigList();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellValueChanged(row: any) {
    const model = {
       ...row.data,
       description: row.newValue
    };
    this.listService.UpdateLookupValue(model).subscribe(res => {
      this.storage.set(Keys.REG_FEE, model.description);
    })

  }
}
