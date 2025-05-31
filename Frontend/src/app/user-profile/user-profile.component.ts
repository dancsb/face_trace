import { Component, inject, OnInit, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { NavbarComponent } from "../navbar/navbar.component";
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatGridListModule,
    NavbarComponent,
    FormsModule,
    CommonModule
],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  userService: UserService = inject(UserService);
  private userSubscription!: Subscription;

  isEditing: boolean = false;
  userName : string;
  email : string;

  constructor(private router: Router, private toastr: ToastrService, private route: ActivatedRoute) {
    this.userName = this.route.snapshot.data['data'].user.user_name;
    this.email = this.route.snapshot.data['data'].user.email;
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe((user) => {
      this.userName = user.user_name;
      this.email = user.email;
    });
  }

  editProfile() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {    
    let isSuccess = this.userService.updateUser(this.userName, this.email);
    isSuccess.then((isSuccess) => {
      if (isSuccess) {
        this.isEditing = false;
        this.toastr.success('Profile updated successfully', 'Success');
      }
    });
  }

  changePassword() {
    // Logic for logging out (e.g., navigate to login page or clear session)
    this.router.navigate(['/change-password']);
  }
}
