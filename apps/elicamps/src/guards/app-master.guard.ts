import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Keys } from '../common/lookup.enums';
@Injectable({
  providedIn: 'root'
})
export class AppMasterGuard implements CanActivate {

   public defaultColDef: any;
  constructor(private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = localStorage.getItem(Keys.TOKEN_INFO);
    if (user == null) {
      this.router.navigate(['auth/login']);
      return false;
    }
    return true;
  }
}
