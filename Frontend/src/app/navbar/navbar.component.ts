import { Component, inject, OnInit, NgModule } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIcon,
    RouterLink
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  userService: UserService = inject(UserService);
  private userSubscription!: Subscription;
  userName : string = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.userName = this.route.snapshot.data['data'].user.user_name;
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.user.subscribe((user) => {
      this.userName = user.user_name;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.userService.logoutUser();
    this.router.navigate(['']);
  }
}
