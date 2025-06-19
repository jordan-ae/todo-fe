import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Priority, TaskFilter } from '../models/task.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filterSubject = new BehaviorSubject<TaskFilter>({
    search: '',
    category: '',
    priority: null,
    showCompleted: true,
    showFavorites: false
  });

  tasks$ = this.tasksSubject.asObservable();
  filter$ = this.filterSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.apiService.getTasks().subscribe(
      (response) => {
        const tasks = response.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        this.tasksSubject.next(tasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        // Fallback to local storage if API fails
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          const tasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt)
          }));
          this.tasksSubject.next(tasks);
        }
      }
    );
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasksSubject.value));
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.apiService.createTask(newTask).subscribe(
      (response) => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, newTask]);
        this.saveTasks();
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.apiService.updateTask(id, updates).subscribe(
      (response) => {
        const currentTasks = this.tasksSubject.value;
        const updatedTasks = currentTasks.map(task =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        );
        this.tasksSubject.next(updatedTasks);
        this.saveTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  deleteTask(id: string): void {
    this.apiService.deleteTask(id).subscribe(
      (response) => {
        const currentTasks = this.tasksSubject.value;
        const filteredTasks = currentTasks.filter(task => task.id !== id);
        this.tasksSubject.next(filteredTasks);
        this.saveTasks();
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  toggleComplete(id: string): void {
    this.apiService.toggleComplete(id).subscribe(
      (response) => {
        const task = this.tasksSubject.value.find(t => t.id === id);
        if (task) {
          this.updateTask(id, { completed: !task.completed });
        }
      },
      (error) => {
        console.error('Error toggling complete status:', error);
      }
    );
  }

  toggleFavorite(id: string): void {
    this.apiService.toggleFavorite(id).subscribe(
      (response) => {
        const task = this.tasksSubject.value.find(t => t.id === id);
        if (task) {
          this.updateTask(id, { favorite: !task.favorite });
        }
      },
      (error) => {
        console.error('Error toggling favorite status:', error);
      }
    );
  }

  updateFilter(filter: Partial<TaskFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  getCategories(): string[] {
    const tasks = this.tasksSubject.value;
    const categories = Array.from(new Set(tasks.map(task => task.category).filter(Boolean)));
    return categories.sort();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}