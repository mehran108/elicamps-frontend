import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

   public defaultColDef;
  constructor() { }

  set(key: any, value: any): void {
      localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: any) {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
      }
    return null;
  }
  remove(key: any): void {
    localStorage.removeItem(key);
  }
}
