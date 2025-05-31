import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  userService: UserService = inject(UserService);
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Initialize form
    // send auth/validate request to backend and according to that navigate to customize page or login page or landing page
  }

  async onSubmit() {
    
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      
      await this.userService.loginUser(formData).then((res) => {
        if (res.success) {
          this.toastr.success('Login Successfull');
          this.userService.getUserFromDb().then((res) => {
            if (res.success) {
              this.router.navigate(['/landing']);
            }
          });
        } else {
          this.toastr.error(res.message, 'Login Failed');
        }
      });
    }
  }
}