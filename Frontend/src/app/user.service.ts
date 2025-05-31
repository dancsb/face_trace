import { inject, Injectable } from '@angular/core';
import { User, Username } from './user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>({
    _id: '',
    user_name: '',
    email: '',
  });
  private userIsAvailableSubject = new BehaviorSubject<boolean>(false);
  user = this.userSubject.asObservable();
  userIsAvailable = this.userIsAvailableSubject.asObservable();
  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  async createUser(formData: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<{id: string, message: string}>(`${environment.apiUrl}/user`, formData, { headers: { 'Content-Type': 'application/json' } })
          .subscribe({
            next: (response) => {
              this.userSubject.next({_id: response.id, user_name: formData.username, email: formData.email});
              resolve(true);
          }, error: (error) => {
            resolve(false);
          }
        });
    });
  }

  async loginUser(formData: any): Promise<{ success: boolean, message: string }> {
    // Login user
    // If successful, update userSubject
    return new Promise((resolve, reject) => {
      this.http.post<{ message: string }>(`${environment.apiUrl}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      })
      .subscribe({
        next: (response) => {
          this.isLoggedIn = true;
          //this.getUserFromDb();
          // TODO this.getFriends
          resolve({ success: true, message: response.body?.message || 'Login successful' });
        }, error: (error) => {
          if (error.status === 401 || error.status === 404) {
            //console.error('Login failed:', error);
            resolve({ success: false, message: error.error?.message || 'Login unsuccessful' });
          } else {
            reject(false);
          }
        }
      });
    });
  }

  async logoutUser(): Promise<{ success: boolean, message: string }> {
    // Logout user
    // If successful, update userSubject
    return new Promise((resolve, reject) => {
      this.http.post<{ message: string }>(`${environment.apiUrl}/auth/logout`, {}, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          this.userSubject.next({ _id: '', user_name: '', email: ''});
          this.isLoggedIn = false;
          resolve({ success: true, message: response.body?.message || 'Logout successful' });
        }, error: (error) => {
          //console.error('Failed to logout user:', error);
          reject(false);
        }
      });
    });
  }



  async getFriends(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<{users: []}>(`${environment.apiUrl}/friends`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(response.body?.users || []);
        }, error: (error) => {
          console.error('Failed to get friends:', error);
          reject([]);
        }
      });
    });
  }

  updateUser(user_name: string, email: string): Promise<boolean> {
    // Update user in database
    // If successful, update userSubject
    const user = {
      username: user_name,
      email: email
    };
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/user`, user, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          this.userSubject.next({ ...this.userSubject.value, user_name, email });
          resolve(true);
        }, error: (error) => {
          console.error('Failed to update user data:', error);
          reject(false);
        }
      });
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    // Change password
    // If successful, update userSubject
    const password = {
      oldPassword: currentPassword,
      newPassword: newPassword
    };
    return new Promise((resolve, reject) => {
      this.http.put<{ message: string }>(`${environment.apiUrl}/user/change_password`, password, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(true);
        }, error: (error) => {
          console.error('Failed to change password:', error);
          reject(false);
        }
      });
    });
  }

  async searchUsers(query: string): Promise<{isSuccess: boolean, data: any[]}> {
    return new Promise((resolve, reject) => {
      this.http.get<{users: []}>(`${environment.apiUrl}/user_search`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true,
        params: { username: query }
      }).subscribe({
        next: (response) => {
          resolve({isSuccess: true, data: response.body?.users || []});
        }, error: (error) => {
          console.error('Failed to get users:', error);
          reject({isSuccess: false, data: []});
        }
      });
    });
  }

  async sendFriendRequest(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.post<{ message: string }>(`${environment.apiUrl}/friends/request/${id}`, {}, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(true);
        }, error: (error) => {
          console.error('Failed to send friend request:', error);
          reject(false);
        }
      });
    });
  }

  async getIncomingFriendRequests(): Promise<{isSuccess: boolean, data: any[]}> {
    return new Promise((resolve, reject) => {
      this.http.get<{users: []}>(`${environment.apiUrl}/friends/requests/ingoing`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          this.userSubject.next({ ...this.userSubject.value});
          resolve({isSuccess: true, data: response.body?.users || []});
        }, error: (error) => {
          console.error('Failed to get incoming friend requests:', error);
          reject({isSuccess: false, data: []});
        }
      });
    });
  }

  async getOutgoingFriendRequests(): Promise<{isSuccess: boolean, data: any[]}> {
    return new Promise((resolve, reject) => {
      this.http.get<{users: []}>(`${environment.apiUrl}/friends/requests/outgoing`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve({isSuccess: true, data: response.body?.users || []});
        }, error: (error) => {
          console.error('Failed to get outgoing friend requests:', error);
          reject({isSuccess: false, data: []});
        }
      });
    });
  }

  async getFriendList(): Promise<{isSuccess: boolean, data: any[]}> {
    return new Promise((resolve, reject) => {
      this.http.get<{users: []}>(`${environment.apiUrl}/friends`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          this.getIncomingFriendRequests();
          this.userSubject.next({ ...this.userSubject.value });
          resolve({isSuccess: true, data: response.body?.users || []});
        }, error: (error) => {
          console.error('Failed to get friends:', error);
          reject({isSuccess: false, data: []});
        }
      });
    });
  }

  async acceptFriendRequest(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.put<{ message: string }>(`${environment.apiUrl}/friends/request/${id}/accept`, {}, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          this.getFriendList();
          this.userSubject.next({ ...this.userSubject.value });
          resolve(true);
        }, error: (error) => {
          console.error('Failed to accept friend request:', error);
          reject(false);
        }
      });
    });
  }

  async rejectFriendRequest(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.put<{ message: string }>(`${environment.apiUrl}/friends/request/${id}/reject`, {}, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: (response) => {
          resolve(true);
        }, error: (error) => {
          console.error('Failed to reject friend request:', error);
          reject(false);
        }
      });
    });
  }
  async getUserFromDb(): Promise<{success: boolean, user: any}> {
    return new Promise((resolve, reject) => {
      this.http.get<{createdAt: string, id: string, email: string, username: string}>(`${environment.apiUrl}/user`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
      }).subscribe({
        next: async (response) => {
          const user = {
            _id: response.body?.id || '',
            user_name: response.body?.username || '',
            email: response.body?.email || '',
          } as User;
          this.userSubject.next(user);
          this.isLoggedIn = true;
          resolve({success: true, user});
        },
        error: (error) => {
          if (error.status === 401) {
            console.error('User not logged in:', error);
            resolve({success: false, user: null});
          }
          console.error('Failed to get user data:', error);
          reject(false);
        }
      });
    });
  }
  async removeFriend(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.delete<{ message: string }>(`${environment.apiUrl}/friends/${id}`, {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        withCredentials: true
        }).subscribe({
          next: (response) => {
            this.userSubject.next({ ...this.userSubject.value });
            resolve(true);
          }, error: (error) => {
            console.error('Failed to remove friend:', error);
            reject(false);
          }
        });
    });
  }

  getUsernameById(userId: string): Observable<Username> {
    const url = `${environment.apiUrl}/user/${userId}`;
    const result = this.http.get<Username>(`${environment.apiUrl}/user/${userId}`, { withCredentials: true });
    return result;
  }




  getID(): string {
    return this.userSubject.value._id;
  }

  getUserName(): string {
    return this.userSubject.value.user_name;
  }

  getEmail(): string {
    return this.userSubject.value.email;
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  setUserName(user_name: string): void {
    // Update user in database
    // If successful, update userSubject
    this.userSubject.next({ ...this.userSubject.value, user_name });
  }

  setEmail(email: string): void {
    // Update user in database
    // If successful, update userSubject
    this.userSubject.next({ ...this.userSubject.value, email });
  }
}
