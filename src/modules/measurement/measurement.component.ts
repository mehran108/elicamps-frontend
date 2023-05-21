import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { ChipRendererComponent } from 'src/common/ag-grid/renderers/chip-renderer/chip-renderer.component';
@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html'
})
export class MeasurementComponent implements OnInit {
 public defaultColDef;

  public columnDefs = [
    {
      field: 'id'
    },
    {
      field: 'customerName'
    },
    {
      field: 'shirtChest'
    },
    {
      field: 'shirtWaist'
    },
    {
      field: 'shoulder'
    },
    {
      field: 'sleeves'
    },
    {
      field: 'neck'
    },
    {
      field: 'shalwarLength'
    },
    {
      field: 'shalwarBottom'
    },
    {
      field: 'ghera'
    },
    {
      field: 'asan'
    },
    {
      field: 'coatLength'
    },
    {
      field: 'crossBack'
    },
    {
      field: 'halfBack'
    },
    {
      field: 'pentLength'
    },
    {
      field: 'pentWaist'
    },
    {
      field: 'hip'
    },
    {
      field: 'knee'
    },
    {
      field: 'pentBottom'
    },
    {
      field: 'inside'
    },
    {
      field: 'thai'
    },
  ];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public customerMeasurementList: Array<any> = new Array();
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
  public getCustomerMeasurementList = () => {
    const params = {
      active: true
    };
    this.listService.GetCustomerMeasurements({}).subscribe((res: Array<any>) => {
      this.customerMeasurementList = res;
      this.autoSizeAll(false);
      // this.gridColumnApi.getColumn('active').setSort('desc');
    });
  }
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getCustomerMeasurementList();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event) {
    this.router.navigate(['measurement/form'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });
  }
  onBtnExport(): void {
    // this.listService.exportGridData(this.gridApi, 'customer')
  }
}
