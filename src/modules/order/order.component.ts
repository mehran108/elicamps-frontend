import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from '../../services/list.service';
import { ChipRendererComponent } from 'src/common/ag-grid/renderers/chip-renderer/chip-renderer.component';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
 public defaultColDef;

  public columnDefs = [
    {
      field: 'id'
    },
    {
      field: 'customerName'
    },
    {
      field: 'suitQuantity'
    },
    {
      field: 'createdDate'
    },
    {
      field: 'total'
    },
    {
      field: 'advance'
    },
    {
      field: 'balance'
    },
    {
      field: 'deliveryDate'
    },
  ];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public orderList: Array<any> = new Array();
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
  public getOrderList = () => {
    const params = {
      active: true
    };
    this.listService.GetOrders({}).subscribe((res: Array<any>) => {
      this.orderList = res;
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
    this.getOrderList();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event) {
    this.router.navigate(['addCustomer'], {
      queryParams: {
        id: btoa($event.data.id)
      }
    });
  }
  onBtnExport(): void {
    // this.listService.exportGridData(this.gridApi, 'customer')
  }
}
