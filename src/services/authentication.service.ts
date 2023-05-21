import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

   public defaultColDef;
  constructor(public http: HttpClient) { }
  public login(model: any) {
    return this.http.post<any>(`${environment.appUser}/authenticate`, model);
  }
  getAll() {
      return this.http.get<any[]>(`${environment.appUser}/users`);
  }

  // getById(id: number) {
  //     return this.http.get(`${config.apiUrl}/users/` + id);
  // }

  register(model) {

    return this.http.post<any>(`${environment.appUser}/users/register`, model);
  }
  UpdateUser(userObject: any) {

    return this.http.put(`${environment.appUser}/users/UpdateUser`, userObject);
  }

  forgotPassword(forgotPasswordObject: any) {

    return this.http.post<any>(`${environment.appUser}/users/ForgotPassword`, forgotPasswordObject);
  }
  resetPassword(resetPasswordObject: any) {

    return this.http.post<any>(`${environment.appUser}/users/ResetPassword`, resetPasswordObject);
  }
  GetUserById(id: string) {
    return this.http.get<any>(`${environment.appUser}/Users/${id}`, {});
  }
  ChangePassword(obj: any) {
    return this.http.put(`${environment.appUser}/Users/UpdatePassword`, obj);
  }
}
