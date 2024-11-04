/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { GROUPS_COL_DEFS } from 'apps/elicamps/src/common/elicamps-column-definitions';
import { ButtonRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/button-renderer.component';
import { ChipRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { Group } from 'apps/elicamps/src/models/Elicamps';
import { GroupService } from 'apps/elicamps/src/services/group.service';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { DeleteConfirmationDialogComponent } from '../../../common/features/confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  public columnDefs: any = GROUPS_COL_DEFS;
  public rowData!: any[];
  public gridOptions: any;
  public info!: string;
  private gridApi: any;
  public groupList: Group[] = [];
  public gridColumnApi: any;
  public defaultColDef: any;
  constructor(
    private groupService: GroupService,
    public router: Router,
    public confirmationDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    public dialog: MatDialog,
    public spinner: NgxSpinnerService,
    public listService: ListService
  ) {}

  ngOnInit() {
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
    this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
        buttonRenderer: ButtonRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
    const buttonRenderer = {
      headerName: '',
      field: 'cancel',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openRemoveGroupDialog.bind(this),
      },
      pinned: 'right',
      width: 80,
    };
    this.columnDefs = [];
    this.columnDefs.push(...GROUPS_COL_DEFS, buttonRenderer as any);
    this.getGroupList();
  }
  openRemoveGroupDialog(group: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        width: '250px',
        data: { headerName: `${group.rowData.refNumber}` },
      }
    );

    this.confirmationDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(group.rowData);
      }
    });
  }
  delete(rowData: any) {
    const row = {
      id: rowData.id,
      isDelete: true,
    };
    this.spinner.show();
    this.groupService.deleteGroup(row).subscribe(
      (res) => {
        this.spinner.hide();
        this.getGroupList();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getGroupList();
  }
  public getGroupList = () => {
    const params = {
      active: true,
    };
    this.groupService
      .getAllElicampsGroups(params)
      .subscribe((groupList: any) => {
        this.groupList = ((groupList as any).data || []).sort(
          (a: any, b: any) => (a.active > b.active ? -1 : 0)
        );
        this.autoSizeAll(false);
        // this.gridColumnApi.getColumn('active').setSort('desc');
      });
  };
  autoSizeAll(skipHeader: any) {
    const allColumnIds: any = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }

  onCellClicked($event: any) {
    this.router.navigate(['addGroup'], {
      queryParams: {
        groupId: btoa($event.data.id.toString()),
      },
    });
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Groups');
  }
}
