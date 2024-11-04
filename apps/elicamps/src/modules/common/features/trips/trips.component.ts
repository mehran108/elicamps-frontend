/* eslint-disable @nx/enforce-module-boundaries */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { TRIP_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { Trip } from 'apps/elicamps/src/models/Elicamps';
import { ListService } from 'apps/elicamps/src/services/list.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {

  public columnDefs: any = TRIP_COL_DEFS;
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public tripList!: Trip[];
  public gridColumnApi: any;
  @Input() public isEdit = false;
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
    this.getAllTrips();
  }
  public getAllTrips = () => {
    this.listService.getAllTrips().subscribe(res => {
      this.tripList = res.data;
      this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Students')
  }
  onCellClicked($event: any) {

    this.router.navigate(['addTrip'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
