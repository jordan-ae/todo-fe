export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  favorite: boolean;
  priority: Priority;
  category: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface TaskFilter {
  search: string;
  category: string;
  priority: Priority | null;
  showCompleted: boolean;
  showFavorites: boolean;
}