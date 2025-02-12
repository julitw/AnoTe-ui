import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';

interface Project {
  id: number;
  name: string;
  labels: string;
  textColumn: string;
  labelsColumn: string;
  annotated?: number;
  total?: number ;
}

@Injectable({
  providedIn: 'root'
})
export class MyProjectsService {

  private apiUrl = 'http://127.0.0.1:8000/api/projects';

  constructor(private http: HttpClient) { }

  addProject(formData: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  annotateProject(id: number, limit: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/annotate?limit=${limit}`, {});
  }

  downloadAnnotatedFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
  }

  getAnnotatedData(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${projectId}/annotated-data`);
  }
  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}`);
  }
  
  fetchColumns(formDataFile: FormData): Observable<any>{
    return  this.http.post<{ unique_values: string[] }>(`${this.apiUrl}/get_columns`, formDataFile)
  }

  fetchUniqueLabels(formData: FormData): Observable<any>{
    return this.http.post<{ unique_values: string[] }>(`${this.apiUrl}/get_unique_values`, formData)
  }
  
}
