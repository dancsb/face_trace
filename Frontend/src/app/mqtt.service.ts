import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FaceTraceMqttService {
    private subscription: Subscription | null = null;
    private isConnected = false;
    constructor(
        private mqttService: MqttService,
        private toastr: ToastrService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        // Only initialize MQTT connection in browser environment
        if (isPlatformBrowser(this.platformId)) {
            this.initializeMqttConnection();
        }
    } private initializeMqttConnection(): void {
        // Only run in browser environment
        if (!isPlatformBrowser(this.platformId)) {
            console.log('MQTT service skipped - not in browser environment');
            return;
        }

        try {
            // Connect with authentication credentials (cast to any to bypass strict typing)
            this.mqttService.connect({
                hostname: 'mqtt.dancs.org',
                port: 8084,
                path: '/mqtt',
                protocol: 'wss',
                clientId: `FaceTrace_${Math.random().toString(16).substring(2, 10)}`,
                username: 'FaceTrace',
                password: 'E8Oqs8h4rlNSEat6'
            } as any);

            // Listen for connection events
            this.mqttService.onConnect.subscribe(() => {
                this.isConnected = true;
                console.log('MQTT connected successfully');
                this.subscribeToNotifications();
            });

            this.mqttService.onError.subscribe((error) => {
                this.isConnected = false;
                console.error('MQTT connection error:', error);
                this.toastr.error('Failed to connect to notification service', 'Connection Error');
            });

            this.mqttService.onClose.subscribe(() => {
                this.isConnected = false;
                console.log('MQTT connection closed');
            });
        } catch (error) {
            console.error('Error initializing MQTT connection:', error);
        }
    } subscribeToNotifications(): void {
        // Only run in browser environment
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (!this.isConnected) {
            console.warn('MQTT not connected, attempting to reconnect...');
            this.initializeMqttConnection();
            return;
        }

        // Unsubscribe from previous subscription if it exists
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        // Subscribe to the FaceTrace/notification topic
        this.subscription = this.mqttService.observe('FaceTrace/notification').subscribe({
            next: (message: IMqttMessage) => {
                try {
                    // Parse the JSON message
                    const notificationData = JSON.parse(message.payload.toString());
                    //console.log('Received MQTT notification:', notificationData);

                    // Display toastr notification
                    this.showNotification(notificationData);
                } catch (error) {
                    console.error('Error parsing MQTT message:', error);
                    this.toastr.error('Received invalid notification data', 'Notification Error');
                }
            },
            error: (error) => {
                console.error('MQTT subscription error:', error);
                this.toastr.error('Lost connection to notification service', 'Connection Error');
            }
        });

        console.log('Subscribed to FaceTrace/notification topic');
    }

    private showNotification(data: any): void {
        const { description, detectedPeopleCount } = data;

        // Create notification message
        const message = `${description} - ${detectedPeopleCount} people detected`;

        // Show toastr notification
        this.toastr.info(message, 'Face Detection Alert', {
            timeOut: 5000,
            extendedTimeOut: 2000,
            progressBar: true,
            closeButton: true
        });
    }
    unsubscribeFromNotifications(): void {
        // Only run in browser environment
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }
    ngOnDestroy(): void {
        // Only run cleanup in browser environment
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        this.unsubscribeFromNotifications();

        // Only disconnect if we're actually connected
        if (this.isConnected && this.mqttService) {
            try {
                this.mqttService.disconnect();
            } catch (error) {
                console.warn('Error disconnecting MQTT service:', error);
            }
        }
    }

    // Getter to check connection status
    get connected(): boolean {
        return this.isConnected;
    }
}