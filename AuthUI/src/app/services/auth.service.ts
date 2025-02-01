import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7015/api/User/';
  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user);
  }

  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}login`, user);
  }
}
