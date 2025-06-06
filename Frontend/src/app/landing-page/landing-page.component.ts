import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {ImageService} from '../image.service';
import {Image} from '../image';
import {NavbarComponent} from '../navbar/navbar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NgFor, NgIf, NgStyle} from '@angular/common';
import {environment} from '../../environments/environment';
import {DatePipe} from '@angular/common';
import {UserService} from '../user.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    NavbarComponent,
    MatSidenavModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    NgFor,
    NgIf,
    NgStyle,
    DatePipe
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  imageService = inject(ImageService);
  userService = inject(UserService);
  selectedImage: Image | null = null;
  openFullImage(image: Image) {
    this.selectedImage = image;
    this.selectedImageUrl = image.url;
    document.body.classList.add('overlay-open');
  }
  closeFullImage() {
    this.selectedImage = null;
    this.selectedImageUrl = null;
    document.body.classList.remove('overlay-open');
  }

  description: string = '';
  selectedFile?: File;
  images: Image[] = [];
  selectedImageUrl: string | null = null;
  onImageLoad(event: Event, image: Image) {
    const img = event.target as HTMLImageElement;
    
    // Calculate the actual displayed dimensions considering object-fit: contain
    const containerWidth = img.offsetWidth;
    const containerHeight = img.offsetHeight;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    // Calculate scale factor to maintain aspect ratio (object-fit: contain behavior)
    const scaleX = containerWidth / naturalWidth;
    const scaleY = containerHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate the actual displayed image dimensions
    const displayedWidth = naturalWidth * scale;
    const displayedHeight = naturalHeight * scale;
    
    // Calculate offset to center the image within the container
    const offsetX = (containerWidth - displayedWidth) / 2;
    const offsetY = (containerHeight - displayedHeight) / 2;

    // Create a new array for scaled boxes instead of modifying the original
    image.scaledBoxes = image.boundingBoxes.map((box: { x: number; y: number; width: number; height: number }) => ({
      x: box.x * scale + offsetX,
      y: box.y * scale + offsetY,
      width: box.width * scale,
      height: box.height * scale
    }));
  }
  ngOnInit(): void {
    this.loadImages();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overlay-open');
  }

  async loadImages(): Promise<void> {
    try {
      const temp = await this.imageService.getAllImages();
      this.images = await Promise.all(
        temp.map(async (image) => {
          const uploaderName = await this.userService.getUsernameById(image.uploadedBy).toPromise();
          return {
            ...image,
            url: environment.apiUrl.replace(/\/$/, '') + "/" + image.url,
            uploaderName: uploaderName?.username || 'Unknown'
          };
        })
      );
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  }
  onPreviewImageLoad(event: Event, image: Image) {
    const img = event.target as HTMLImageElement;

    // Use a single uniform scale factor based on the displayed dimensions
    const scale = img.clientWidth / img.naturalWidth;

    // Adjust Y-axis placement to account for centering
    const offsetY = (img.clientHeight - img.naturalHeight * scale) / 2;

    image.previewBoxes = image.boundingBoxes.map(box => {
      const x = Math.max(0, Math.min(box.x * scale, img.clientWidth));
      const y = Math.max(0, Math.min(box.y * scale + offsetY, img.clientHeight));
      const width = Math.min(box.width * scale, img.clientWidth - x);
      const height = Math.min(box.height * scale, img.clientHeight - y);

      return { x, y, width, height };
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async upload(): Promise<void> {
    if (!this.selectedFile || !this.description) return;

    try {
      await this.imageService.uploadImage(this.selectedFile, this.description);
      this.description = '';
      this.selectedFile = undefined;
      await this.loadImages();
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  }
}

