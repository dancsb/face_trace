import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {Image} from './image';
import {environment} from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {

  constructor(private http: HttpClient) {}

  async getAllImages(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<{images: []}>(`${environment.apiUrl}/images`, {
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(response.body?.images || []);
        },
        error: (error) => {
          console.error('Failed to fetch images:', error);
          reject([]);
        }
      });
    });
  }


  async uploadImage(file: File, description: string): Promise<boolean> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);

    return new Promise((resolve, reject) => {
      this.http.post<{ message: string }>(`${environment.apiUrl}/images`, formData, {
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(true);
        },
        error: (error) => {
          console.error('Failed to upload image:', error);
          reject(false);
        }
      });
    });
  }

}
