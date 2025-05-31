import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
 import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../user';

 @Injectable({
    providedIn: 'root',
  })
  export class DataResolver implements Resolve<any> {
    constructor(private userService: UserService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      const { success: successUser, user } = await this.userService.getUserFromDb();
      return { successUser: successUser, user: user as User};
    }
  }
  