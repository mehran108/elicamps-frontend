import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
import { Keys, LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { LocalstorageService } from 'src/EliCamps/services/localstorage.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  public columnDefs = [
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
  public info: string;
  private gridApi: any;
  public configList = [];
  public modules = AllCommunityModules;
  public gridColumnApi: any;
  constructor(public router: Router, public listService: ListService, public storage: LocalstorageService) {
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
  public getConfigList = () => {
    this.listService.getAll(LookupEnum.CONFIG).subscribe(res => {
      this.configList = res;
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getConfigList();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellValueChanged(row) {
    const model = {
      name: row.data.name,
      description: row.newValue,
      value: row.newValue
    };
    this.listService.UpdateLookupValue(model).subscribe(res => {
      this.storage.set(Keys.REG_FEE, model.description);
    })

  }
}
