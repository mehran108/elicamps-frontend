import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { ChipRendererComponent } from 'src/common/ag-grid/renderers/chip-renderer/chip-renderer.component';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
 public defaultColDef;

  public columnDefs = [
    {
      field: 'id'
    },
    {
      field: 'name'
    },
    {
      field: 'phoneNumber'
    },
    {
      field: 'address'
    },
    {
      field: 'Active'
    }
  ];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public CustomerList: Array<any> = new Array();
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
  public getCustomerList = () => {
    const params = {
      active: true
    };
    this.listService.GetCustomers({}).subscribe((res: Array<any>) => {
      this.CustomerList = res;
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
    this.getCustomerList();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event) {
    this.router.navigate(['customer/form'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });
  }
  onBtnExport(): void {
    // this.listService.exportGridData(this.gridApi, 'customer')
  }
}
