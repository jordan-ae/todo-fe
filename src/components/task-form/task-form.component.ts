import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task, Priority } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h3>{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h3>
      
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title *</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            class="form-input"
            [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
          />
          <div *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched" class="error-message">
            Title is required
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category">Category</label>
            <input
              id="category"
              type="text"
              formControlName="category"
              class="form-input"
              placeholder="e.g., Work, Personal"
            />
          </div>
          
          <div class="form-group">
            <label for="priority">Priority</label>
            <select id="priority" formControlName="priority" class="form-select">
              <option [value]="Priority.LOW">Low</option>
              <option [value]="Priority.MEDIUM">Medium</option>
              <option [value]="Priority.HIGH">High</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            formControlName="dueDate"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" formControlName="favorite" />
            <span>Mark as Favorite</span>
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" (click)="onCancel()" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" [disabled]="taskForm.invalid" class="btn btn-primary">
            {{ isEditing ? 'Update' : 'Add' }} Task
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .form-container h3 {
      margin: 0 0 24px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    
    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: #333;
    }
    
    .form-input.error {
      border-color: #e74c3c;
    }
    
    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
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
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background: #333;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #555;
    }
    
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #d0d0d0;
    }
    
    .btn-secondary:hover {
      background: #e9ecef;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() isVisible = false;
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();
  @Output() cancel = new EventEmitter<void>();
  
  taskForm: FormGroup;
  Priority = Priority;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: [''],
      priority: [Priority.MEDIUM],
      dueDate: [''],
      favorite: [false],
      completed: [false]
    });
  }
  
  ngOnInit(): void {
    if (this.task) {
      this.populateForm();
    }
  }
  
  get isEditing(): boolean {
    return !!this.task;
  }
  
  private populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        category: this.task.category,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? this.formatDate(this.task.dueDate) : '',
        favorite: this.task.favorite,
        completed: this.task.completed
      });
    }
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData = {
        ...formValue,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : null
      };
      this.save.emit(taskData);
      this.resetForm();
    }
  }
  
  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }
  
  private resetForm(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      category: '',
      priority: Priority.MEDIUM,
      dueDate: '',
      favorite: false,
      completed: false
    });
  }
}