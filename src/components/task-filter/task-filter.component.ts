import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Priority, TaskFilter } from '../../models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <div class="filter-row">
        <div class="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            [(ngModel)]="filter.search"
            (input)="updateFilter()"
            class="search-input"
          />
        </div>
        
        <div class="filter-group">
          <select [(ngModel)]="filter.category" (change)="updateFilter()" class="filter-select">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <select [(ngModel)]="filter.priority" (change)="updateFilter()" class="filter-select">
            <option [ngValue]="null">All Priorities</option>
            <option [ngValue]="Priority.HIGH">High</option>
            <option [ngValue]="Priority.MEDIUM">Medium</option>
            <option [ngValue]="Priority.LOW">Low</option>
          </select>
        </div>
      </div>
      
      <div class="filter-row">
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="filter.showCompleted"
              (change)="updateFilter()"
            />
            <span>Show Completed</span>
          </label>
          
          <label class="checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="filter.showFavorites"
              (change)="updateFilter()"
            />
            <span>Favorites Only</span>
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    
    .filter-row {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .filter-row:last-child {
      margin-bottom: 0;
    }
    
    .filter-group {
      flex: 1;
    }
    
    .search-input,
    .filter-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 14px;
      background: white;
    }
    
    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #333;
    }
    
    .checkbox-group {
      display: flex;
      gap: 24px;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }
    
    .checkbox-label input[type="checkbox"] {
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .filter-row {
        flex-direction: column;
        gap: 12px;
      }
      
      .checkbox-group {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class TaskFilterComponent implements OnInit, OnDestroy {
  filter: TaskFilter = {
    search: '',
    category: '',
    priority: null,
    showCompleted: true,
    showFavorites: false
  };
  
  categories: string[] = [];
  Priority = Priority;
  
  private destroy$ = new Subject<void>();
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    this.taskService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filter = { ...filter };
      });
    
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.categories = this.taskService.getCategories();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  updateFilter(): void {
    this.taskService.updateFilter(this.filter);
  }
}