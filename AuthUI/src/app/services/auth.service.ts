import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7044/api/User/';
  private userPayload: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    this.userPayload = this.decodeToken();
  }

  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}login`, user);
  }

  logout() {
    let key = this.getToken();
    if (key != null) {
      this.storageService.removeItem(key);
      this.router.navigate(['/login']);
    }
  }

  storeToken(tokenValue: string) {
    this.storageService.setItem('token', tokenValue);
  }
  getToken() {
    return this.storageService.getItem('token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.name;
    }
  }
  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }
}
