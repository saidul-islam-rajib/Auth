import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7044/api/User/';
  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}login`, user);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }
  getToken(){
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }
}
