import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  addProject(project: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', project.name);
    formData.append('file', project.file);
    formData.append('column_text_name', project.columnTextName);
    formData.append('column_label_name', project.columnLabelName);
    formData.append('available_labels', JSON.stringify(project.availableLabels));

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
  
  
}
