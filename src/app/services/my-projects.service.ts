import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface Project {
  id: number;
  name: string;
  labels: string;
  textColumn: string;
  labelsColumn: string;
  annotated?: number;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MyProjectsService {
  constructor(private http: HttpClient, private apiService: ApiService) {}

  addProject(formData: any): Observable<any> {
    return this.http.post(this.apiService.addProject, formData);
  }

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.projects);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(this.apiService.getProjectById(id));
  }

  annotateProject(id: number, limit: number): Observable<any> {
    return this.http.post(this.apiService.annotateProject(id, limit), {});
  }

  downloadAnnotatedFile(id: number): Observable<Blob> {
    return this.http.get(this.apiService.downloadAnnotatedFile(id), { responseType: 'blob' });
  }

  getAnnotatedData(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.getAnnotatedData(projectId));
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(this.apiService.deleteProject(projectId));
  }

  fetchColumns(formDataFile: FormData): Observable<any> {
    return this.http.post<{ unique_values: string[] }>(this.apiService.getColumns, formDataFile);
  }

  fetchUniqueLabels(formData: FormData): Observable<any> {
    return this.http.post<{ unique_values: string[] }>(this.apiService.getUniqueValues, formData);
  }

  setTrueLabel(id: number, exampleId:string, label: string): Observable<any>{
    return this.http.post(this.apiService.setTrueLabel(id, exampleId, label), {})
  }

  getNextAnnotatedIds(id: number, limit: number): Observable<{ message: string, updated_ids: string[] }> {
    return this.http.get<{ message: string, updated_ids: string[] }>(this.apiService.getNextAnnotatedId(id, limit));
  }
  
}
