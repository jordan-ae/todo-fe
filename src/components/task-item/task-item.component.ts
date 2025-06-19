import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-item" [class.completed]="task.completed">
      <div class="task-header">
        <div class="task-title-row">
          <label class="checkbox-label">
            <input
              type="checkbox"
              [checked]="task.completed"
              (change)="toggleComplete.emit(task._id)"
            />
            <span class="task-title">{{ task.title }}</span>
          </label>
          
          <div class="task-badges">
            <span class="priority-badge" [class]="'priority-' + task.priority">
              {{ task.priority }}
            </span>
            <span *ngIf="task.category" class="category-badge">
              {{ task.category }}
            </span>
          </div>
        </div>
        
        <div class="task-actions">
          <button
            class="action-btn favorite-btn"
            [class.active]="task.favorite"
            (click)="toggleFavorite.emit(task._id)"
            title="Toggle Favorite"
          >
            ★
          </button>
          <button
            class="action-btn edit-btn"
            (click)="edit.emit(task)"
            title="Edit Task"
          >
            ✏️
          </button>
          <button
            class="action-btn delete-btn"
            (click)="delete.emit(task._id)"
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div *ngIf="task.description" class="task-description">
        {{ task.description }}
      </div>
      
      <div class="task-meta">
        <div class="task-dates">
          <span *ngIf="task.dueDate" class="due-date" [class.overdue]="isOverdue()">
            Due: {{ formatDate(task.dueDate) }}
          </span>
          <span class="created-date">
            Created: {{ formatDate(task.createdAt) }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      transition: all 0.2s;
    }
    
    .task-item:hover {
      border-color: #333;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .task-item.completed {
      opacity: 0.7;
      background: #f8f9fa;
    }
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    
    .task-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      flex: 1;
    }
    
    .checkbox-label input[type="checkbox"] {
      margin: 0;
    }
    
    .task-title {
      font-size: 16px;
      font-weight: 500;
      flex: 1;
    }
    
    .task-item.completed .task-title {
      text-decoration: line-through;
    }
    
    .task-badges {
      display: flex;
      gap: 8px;
    }
    
    .priority-badge,
    .category-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .priority-badge.priority-high {
      background: #fee;
      color: #c53030;
    }
    
    .priority-badge.priority-medium {
      background: #fff4e6;
      color: #dd6b20;
    }
    
    .priority-badge.priority-low {
      background: #f0fff4;
      color: #38a169;
    }
    
    .category-badge {
      background: #f7fafc;
      color: #4a5568;
      border: 1px solid #e2e8f0;
    }
    
    .task-actions {
      display: flex;
      gap: 4px;
    }
    
    .action-btn {
      background: none;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    .action-btn:hover {
      background: #f0f0f0;
    }
    
    .favorite-btn.active {
      color: #f59e0b;
    }
    
    .delete-btn:hover {
      background: #fee;
      color: #c53030;
    }
    
    .task-description {
      margin: 8px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .task-meta {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;
    }
    
    .task-dates {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #888;
    }
    
    .due-date.overdue {
      color: #c53030;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .task-header {
        flex-direction: column;
        gap: 8px;
      }
      
      .task-title-row {
        width: 100%;
      }
      
      .task-badges {
        margin-top: 8px;
      }
      
      .task-dates {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() toggleFavorite = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  
  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
  
  isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    return new Date() > this.task.dueDate && !this.task.completed;
  }

  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
}