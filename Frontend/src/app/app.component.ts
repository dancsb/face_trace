import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from './loading.service';
import { LoadingComponent } from "./loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LoadingComponent, CommonModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading!: Observable<boolean>;
  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.isLoading$
  }
}
