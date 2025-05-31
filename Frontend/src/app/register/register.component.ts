import { Component, Injectable, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

export interface DialogData {
  username: string;
  email: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

@Injectable({providedIn: 'root'})
export class RegisterComponent {
  userService: UserService = inject(UserService);
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, public dialog: MatDialog) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...formData } = this.registerForm.value; // Remove confirmPassword
      const isSuccess = await this.userService.createUser(formData)
      if (isSuccess) {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '250px',
          data: {username: formData.username, email: formData.email}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(["/login"]);
        });
      }
    }
  }
}


@Component({
  selector: 'confirm-email-dialog',
  templateUrl: './confirm-email-dialog.html',
  styleUrl: './confirm-email-dialog.scss',
  standalone: true,
  imports: [
    MatButton,
    MatDialogModule,
    MatDialogTitle,
  ],
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onClick(): void {
    this.dialogRef.close();
  }

}
