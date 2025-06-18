import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskListComponent } from '../task-list/task-list.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent, TaskFilterComponent],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <div class="header-content">
          <div class="header-text">
            <h1>My Tasks</h1>
            <p>Organize your tasks with style and efficiency</p>
          </div>
          
          <div class="header-actions">
            <button 
              class="btn btn-primary"
              (click)="showAddForm = !showAddForm"
            >
              {{ showAddForm ? 'Cancel' : '+ Add Task' }}
            </button>
          </div>
        </div>
      </div>
      
      <main class="tasks-main">
        <div class="tasks-content">
          <app-task-form
            *ngIf="showAddForm || editingTask"
            [task]="editingTask"
            [isVisible]="showAddForm || !!editingTask"
            (save)="onSaveTask($event)"
            (cancel)="onCancelEdit()"
          ></app-task-form>
          
          <app-task-filter></app-task-filter>
          
          <app-task-list 
            (edit)="onEditTask($event)"
          ></app-task-list>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .tasks-container {
      min-height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }
    
    .tasks-header {
      background: white;
      border-bottom: 1px solid #e0e0e0;
      padding: 32px 24px;
    }
    
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-text h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #333;
    }
    
    .header-text p {
      color: #666;
      font-size: 16px;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #333;
      color: white;
    }
    
    .btn-primary:hover {
      background: #555;
      transform: translateY(-1px);
    }
    
    .tasks-main {
      flex: 1;
      padding: 24px;
    }
    
    .tasks-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .tasks-header {
        padding: 24px 16px;
      }
      
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .header-text h1 {
        font-size: 24px;
      }
      
      .header-actions {
        width: 100%;
        justify-content: center;
      }
      
      .tasks-main {
        padding: 16px;
      }
    }
  `]
})
export class TasksComponent implements OnInit {
  showAddForm = false;
  editingTask: Task | null = null;
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    // Component initialization
  }
  
  onEditTask(task: Task): void {
    this.editingTask = task;
    this.showAddForm = false;
  }
  
  onSaveTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id, taskData);
      this.editingTask = null;
    } else {
      this.taskService.addTask(taskData);
      this.showAddForm = false;
    }
  }
  
  onCancelEdit(): void {
    this.editingTask = null;
    this.showAddForm = false;
  }
}