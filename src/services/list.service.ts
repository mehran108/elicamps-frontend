import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalstorageService } from "./localstorage.service";
import { GridApi, ValueFormatterParams } from "@ag-grid-community/all-modules";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListService {
  public defaultColDef;
  constructor(
    private httpClient: HttpClient,
    public storage: LocalstorageService
  ) {}

  // Customer Endpoints
  public GetCustomers(params: any) {
    return this.httpClient.get(`${environment.appCustomer}`, { params });
  }
  public GetCustomerById(id: any) {
    return this.httpClient.get(`${environment.appCustomer}/${id}`);
  }
  public AddCustomer(body: any) {
    return this.httpClient.post(`${environment.appCustomer}`, body);
  }
  public UpdateCustomer(body: any) {
    return this.httpClient.put(`${environment.appCustomer}/${body.id}`, body);
  }
  // Customer Endpoints

  // Customer Measurement Endpoints
  public GetCustomerMeasurements(params: any) {
    return this.httpClient.get(`${environment.appCustomerMeasurement}`, {
      params,
    });
  }
  public GetCustomerMeasurementById(id: any) {
    return this.httpClient.get(`${environment.appCustomerMeasurement}/${id}`);
  }
  public GetCustomerMeasurementByCustomerId(CustomerId: any) {
    return this.httpClient.get(`${environment.appCustomerMeasurement}/${CustomerId}`);
  }
  public AddCustomerMeasurement(body: any) {
    return this.httpClient.post(`${environment.appCustomerMeasurement}`, body);
  }
  public UpdateCustomerMeasurement(body: any) {
    return this.httpClient.put(
      `${environment.appCustomerMeasurement}/${body.id}`,
      body
    );
  }
  // Customer Measurement Endpoints

  // Customer Measurement Endpoints
  public GetOrders(params: any) {
    return this.httpClient.get(`${environment.appOrder}`, {
      params,
    });
  }
  public GetOrderById(id: any) {
    return this.httpClient.get(`${environment.appOrder}/${id}`);
  }
  public GetOrderByCustomerId(customerId: any) {
    return this.httpClient.get(`${environment.appOrder}/${customerId}`);
  }
  public AddOrder(body: any) {
    return this.httpClient.post(`${environment.appOrder}`, body);
  }
  public UpdateOrder(body: any) {
    return this.httpClient.put(
      `${environment.appOrder}/${body.id}`,
      body
    );
  }
  // Customer Measurement Endpoints

  exportGridData(gridApi: GridApi, reportName: string): void {
    gridApi.exportDataAsExcel({
      fileName: `${reportName}${new Date().toLocaleString()}`,
      processCellCallback: (params) => {
        const colDef = params.column.getColDef();
        // try to reuse valueFormatter from the colDef
        if (colDef.valueFormatter) {
          const valueFormatterParams: ValueFormatterParams = {
            ...params,
            data: params.node.data,
            node: params.node!,
            colDef: params.column.getColDef(),
          };
          return colDef.valueFormatter(valueFormatterParams);
        }
        return params.value;
      },
    });
  }
}
