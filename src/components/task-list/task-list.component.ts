import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest, map } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task, TaskFilter } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent],
  template: `
    <div class="task-list-container">
      <div class="task-list-header">
        <h2>Tasks ({{ filteredTasks.length }})</h2>
        <div class="task-summary" *ngIf="tasks.length > 0">
          <span>{{ completedCount }} completed</span>
          <span>{{ favoriteCount }} favorites</span>
        </div>
      </div>
      
      <div *ngIf="filteredTasks.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>{{ getEmptyStateTitle() }}</h3>
        <p>{{ getEmptyStateMessage() }}</p>
      </div>
      
      <div class="task-list">
        <app-task-item
          *ngFor="let task of filteredTasks; trackBy: trackByTaskId"
          [task]="task"
          (toggleComplete)="onToggleComplete($event)"
          (toggleFavorite)="onToggleFavorite($event)"
          (edit)="onEditTask($event)"
          (delete)="onDeleteTask($event)"
        ></app-task-item>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .task-list-header {
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .task-list-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .task-summary {
      display: flex;
      gap: 16px;
      font-size: 14px;
      color: #666;
    }
    
    .task-list {
      padding: 16px;
    }
    
    .task-list:empty {
      display: none;
    }
    
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: #666;
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .task-list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .task-summary {
        gap: 12px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  @Output() edit = new EventEmitter<Task>();
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: TaskFilter = {
    search: '',
    category: '',
    priority: null,
    showCompleted: true,
    showFavorites: false
  };
  
  private destroy$ = new Subject<void>();
  
  constructor(private taskService: TaskService) {}
  
  ngOnInit(): void {
    combineLatest([
      this.taskService.tasks$,
      this.taskService.filter$
    ]).pipe(
      takeUntil(this.destroy$),
      map(([tasks, filter]) => this.filterTasks(tasks, filter))
    ).subscribe(filteredTasks => {
      this.filteredTasks = filteredTasks;
    });
    
    this.taskService.tasks$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
      });
    
    this.taskService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filter = filter;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  get completedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }
  
  get favoriteCount(): number {
    return this.tasks.filter(task => task.favorite).length;
  }
  
  private filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
    return tasks.filter(task => {
      // Search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (filter.category && task.category !== filter.category) {
        return false;
      }
      
      // Priority filter
      if (filter.priority && task.priority !== filter.priority) {
        return false;
      }
      
      // Completed filter
      if (!filter.showCompleted && task.completed) {
        return false;
      }
      
      // Favorites filter
      if (filter.showFavorites && !task.favorite) {
        return false;
      }
      
      return true;
    });
  }
  
  getEmptyStateTitle(): string {
    if (this.tasks.length === 0) {
      return 'No tasks yet';
    }
    
    if (this.filter.showFavorites) {
      return 'No favorite tasks';
    }
    
    if (this.filter.search) {
      return 'No matching tasks';
    }
    
    return 'No tasks found';
  }
  
  getEmptyStateMessage(): string {
    if (this.tasks.length === 0) {
      return 'Create your first task to get started!';
    }
    
    if (this.filter.showFavorites) {
      return 'Mark some tasks as favorites to see them here.';
    }
    
    if (this.filter.search) {
      return 'Try adjusting your search or filters.';
    }
    
    return 'Try adjusting your filters to see more tasks.';
  }
  
  trackByTaskId(index: number, task: Task): string {
    return task._id;
  }
  
  onToggleComplete(taskId: string): void {
    console.log('Toggle Complete Event:', taskId);
    this.taskService.toggleComplete(taskId);
  }
  
  onToggleFavorite(taskId: string): void {
    console.log('Toggle Favorite Event:', taskId);
    this.taskService.toggleFavorite(taskId);
  }
  
  onEditTask(task: Task): void {
    console.log('Edit Task Event:', task);
    this.edit.emit(task);
  }
  
  onDeleteTask(taskId: string): void {
    console.log('Delete Task Event:', taskId);
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
    }
  }
}