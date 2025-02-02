import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7044/api/';
  constructor(
    private http: HttpClient
  ) { }

  getAllUsers(){
    return this.http.get<any>(`${this.baseUrl}User`);

    // return this.http.post<any>(`${this.baseUrl}login`, user);
  }
}
