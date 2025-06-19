import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://to-do-list-be-1.onrender.com';

  constructor(private http: HttpClient) { }

  // Method for login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Method for registration
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Example method to fetch data
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  // Example method to post data
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  //method to create a task
  createTask(taskData: any): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.post(`${this.apiUrl}/tasks`, taskData, { headers });
  }

  // method to update a task
  updateTask(id: string, taskData: any): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.put(`${this.apiUrl}/tasks/${id}`, taskData, { headers });
  }

  // method to get tasks
  getTasks(): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.get(`${this.apiUrl}/tasks`, { headers });
  }

  // method to delete a task
  deleteTask(id: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.delete(`${this.apiUrl}/tasks/${id}`, { headers });
  }

  // method to toggle favorite status
  toggleFavorite(id: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.patch(`${this.apiUrl}/tasks/${id}/favorite`, null, { headers });
  }

  // method to toggle complete status
  toggleComplete(id: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found');
    }

    const headers = { Authorization: `Bearer ${authToken}` };
    return this.http.patch(`${this.apiUrl}/tasks/${id}/complete`, null, { headers });
  }
} 