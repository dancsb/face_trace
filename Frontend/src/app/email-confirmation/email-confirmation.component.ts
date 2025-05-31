import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [],
  template: '',
})
export class EmailConfirmationComponent implements OnInit {
  paramsObject: any;
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params.keys, ...params };
        // Call the backend to confirm the email
        this.http.post<{message: string}>(`${environment.apiUrl}/user/email_confirm`, this.paramsObject.params, {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          withCredentials: true
        }).subscribe({
          next: (response) => {
            // If the email is confirmed, redirect to the login page
            this.router.navigate(['/login']);
            this.toastr.success(response.body?.message, 'Success');
          }, error: (error) => {
            console.error(error);
          }
        });
    });
  }
}

