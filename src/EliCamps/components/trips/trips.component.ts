import { Component, Input, OnInit } from '@angular/core';
import { TRIP_COL_DEFS } from '../../common/elicamps-column-definitions';
import { Router } from '@angular/router';
import { Trip } from '../../EliCamps-Models/Elicamps';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { ListService } from 'src/EliCamps/services/list.service';
@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  public columnDefs = TRIP_COL_DEFS;
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public tripList: Trip[];
  public modules = AllCommunityModules;
  public gridColumnApi: any;
  @Input() public isEdit = false;
  constructor(public router: Router, public listService: ListService) {
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
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onBtnExport(): void {
    const params = {
      columnGroups: true,
      allColumns: true,
      fileName: `Trips${new Date().toLocaleString()}`,
    };
    this.gridApi.exportDataAsCsv(params);
  }
  onCellClicked($event) {

    this.router.navigate(['addTrip'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });

  }
}
