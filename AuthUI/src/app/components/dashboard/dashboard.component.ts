import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private api: ApiService
  ){

  }

  ngOnInit(): void {
      this.api.getAllUsers()
      .subscribe({
        next: (response) => {
          console.log("List of users : ", response);
        },
        error: (err) =>{
          console.log("Error", err.error.message);
        }
      });

  }
}
