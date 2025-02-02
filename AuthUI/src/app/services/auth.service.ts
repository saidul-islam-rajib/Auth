import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7044/api/User/';
  constructor(
    private http: HttpClient,
    private storageService: StorageService

  ) {}

  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}login`, user);
  }

  storeToken(tokenValue: string){
    this.storageService.setItem('token', tokenValue);
  }
  getToken(){
    return this.storageService.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!this.getToken();
  }
}
