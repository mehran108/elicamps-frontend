import { Component, OnInit } from '@angular/core';
import { AGENTS_COL_DEFS, HOMESTAY_COL_DEFS } from '../../common/elicamps-column-definitions';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { HomeStay } from '../../EliCamps-Models/Elicamps';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-home-stays',
  templateUrl: './home-stays.component.html',
  styleUrls: ['./home-stays.component.css']
})
export class HomeStaysComponent implements OnInit {
 public defaultColDef;

  public columnDefs = HOMESTAY_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public homeStayList: HomeStay[];
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
  public getHomeStayList = () => {
    this.listService.getAllHomeStay().subscribe(res => {
      this.homeStayList = (res as any).data;
      this.autoSizeAll(false);
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getHomeStayList();
  }
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Homestay')
  }
  onCellClicked($event) {

    this.router.navigate(['addHomeStay'], {
      queryParams: {
        id: btoa($event.data.homeId)
      }
    });

  }
}
