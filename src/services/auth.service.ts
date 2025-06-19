import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    
    if (savedUser && token) {
      const user = JSON.parse(savedUser);
      user.createdAt = new Date(user.createdAt);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.apiService.login(credentials).pipe(
      map((response: any) => {
        const authUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          createdAt: new Date(response.user.createdAt)
        };

        localStorage.setItem('currentUser', JSON.stringify(authUser));
        localStorage.setItem('authToken', response.token);

        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);

        return { user: authUser, token: response.token };
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.apiService.register(userData).pipe(
      map((response: any) => {
        const authUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          createdAt: new Date(response.user.createdAt)
        };

        localStorage.setItem('currentUser', JSON.stringify(authUser));
        localStorage.setItem('authToken', response.token);

        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);

        return { user: authUser, token: response.token };
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private getStoredUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateToken(): string {
    return 'token_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}