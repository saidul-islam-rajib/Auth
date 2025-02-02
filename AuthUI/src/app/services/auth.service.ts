import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7044/api/User/';
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

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
}
