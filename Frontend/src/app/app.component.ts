import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from './loading.service';
import { LoadingComponent } from "./loading/loading.component";
import { CommonModule } from '@angular/common';
import { FaceTraceMqttService } from './mqtt.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LoadingComponent, CommonModule], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading!: Observable<boolean>;
  
  constructor(
    private loadingService: LoadingService,
    private mqttService: FaceTraceMqttService
  ) {
    this.isLoading = this.loadingService.isLoading$
  }

  ngOnInit(): void {
    // MQTT service is automatically initialized in its constructor
    // The service will handle connection and subscription automatically
    console.log('App component initialized, MQTT service started');
  }

  ngOnDestroy(): void {
    // Clean up MQTT connection when app is destroyed
    this.mqttService.ngOnDestroy();
  }
}
