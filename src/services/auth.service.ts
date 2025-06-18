import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
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
    return of(null).pipe(
      delay(1000),
      map(() => {
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === credentials.email);
        
        if (!user) {
          throw new Error('User not found');
        }
        

        if (user.password !== credentials.password) {
          throw new Error('Invalid password');
        }
        
        const authUser: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        };
        
        const token = this.generateToken();

        localStorage.setItem('currentUser', JSON.stringify(authUser));
        localStorage.setItem('authToken', token);

        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);
        
        return { user: authUser, token };
      })
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return of(null).pipe(
      delay(1000),
      map(() => {

        const users = this.getStoredUsers();

        if (users.find(u => u.email === userData.email)) {
          throw new Error('User with this email already exists');
        }
        
        const newUser = {
          id: this.generateId(),
          name: userData.name,
          email: userData.email,
          password: userData.password,
          createdAt: new Date()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const authUser: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt
        };
        
        const token = this.generateToken();

        localStorage.setItem('currentUser', JSON.stringify(authUser));
        localStorage.setItem('authToken', token);

        this.currentUserSubject.next(authUser);
        this.isAuthenticatedSubject.next(true);
        
        return { user: authUser, token };
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