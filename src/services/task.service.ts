import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Priority, TaskFilter } from '../models/task.model';

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

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
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

    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
    this.saveTasks();
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task =>
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    );
    this.tasksSubject.next(updatedTasks);
    this.saveTasks();
  }

  deleteTask(id: string): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(filteredTasks);
    this.saveTasks();
  }

  toggleComplete(id: string): void {
    const task = this.tasksSubject.value.find(t => t.id === id);
    if (task) {
      this.updateTask(id, { completed: !task.completed });
    }
  }

  toggleFavorite(id: string): void {
    const task = this.tasksSubject.value.find(t => t.id === id);
    if (task) {
      this.updateTask(id, { favorite: !task.favorite });
    }
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