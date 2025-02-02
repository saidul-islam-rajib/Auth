import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.api.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        console.log('Error in dashboard', err);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
