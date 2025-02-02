import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  public role!: string;
  public loggedUser: string = "";


  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.api.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        console.log('Error in dashboard', err);
      },
    });

    this.userStore.getFullNameFromStore()
    .subscribe(val => {
      let familyName = this.auth.getFullNameFromToken();
      this.loggedUser = familyName || val;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  logout() {
    this.auth.logout();
  }
  isDisplay(): boolean{
    console.log("role is : ", this.role)
    return this.role === 'Admin';
  }
}
