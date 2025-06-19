import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="logo" routerLink="/tasks">TodoList</h1>
        </div>
        
        <div class="header-right" *ngIf="currentUser">
          <div class="user-menu">
            <span class="user-name">Hey, {{ currentUser.name }}</span>
            <button class="logout-btn" (click)="onLogout()">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }
    
    .header-left {
      display: flex;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      text-decoration: none;
      cursor: pointer;
      margin: 0;
    }
    
    .logo:hover {
      color: #555;
    }
    
    .header-right {
      display: flex;
      align-items: center;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    
    .logout-btn {
      background: none;
      border: 1px solid #e0e0e0;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: #f8f9fa;
      border-color: #333;
      color: #333;
    }
    
    @media (max-width: 768px) {
      .app-header {
        padding: 0 16px;
      }
      
      .header-content {
        height: 56px;
      }
      
      .logo {
        font-size: 20px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}