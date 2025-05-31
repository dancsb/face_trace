import { inject, Injectable } from '@angular/core';
import {
  CanMatch,
  CanActivate,
  Router,
  Route,
  UrlSegment,
} from '@angular/router';
import { UserService } from '../user.service';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class loggedInGuard implements CanMatch {
  constructor(private authService: UserService, private router: Router, private loadingService : LoadingService) {}
  async canMatch(route: Route, segments: UrlSegment[]): Promise<boolean> {
    this.loadingService.show();
    return await this.authService.getUserFromDb().then((res) => {
      if (res.success) {
        this.router.navigate(['/landing']);
        return false;
      } else {
        return true;
      }
    }, (err) => {
      return false;
    })
    .finally(() => {
      this.loadingService.hide();
    });

  }
}