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

  downloadAnnotatedFile(id: number): Observable<Blob> {
    return this.http.get(this.apiService.downloadAnnotatedFile(id), { responseType: 'blob' });
  }

  getProjectData(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiService.getProjectData(projectId));
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

  setTrueLabel(id: number, exampleId:string, label: number): Observable<any>{
    return this.http.post(this.apiService.setTrueLabel(id, exampleId, label), {})
  }

  getNextAnnotatedIds(id: number, limit: number): Observable<{ message: string, updated_ids: string[] }> {
    return this.http.get<{ message: string, updated_ids: string[] }>(this.apiService.getNextAnnotatedId(id, limit));
  }

  annotateProject(id: number, limit: number): Observable<any> {
    return new Observable(observer => {
      fetch(this.apiService.annotateProject(id, limit), {
        method: "POST"
      })
        .then(response => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
  
          const readStream = () => {
            reader?.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }
  
              buffer += decoder.decode(value, { stream: true });
  
              let boundary = buffer.indexOf("\n");
              while (boundary !== -1) {
                const jsonLine = buffer.slice(0, boundary).trim();
                buffer = buffer.slice(boundary + 1);
  
                if (jsonLine) {
                  try {
                    observer.next(JSON.parse(jsonLine));
                  } catch (err) {
                    observer.error("JSON parse error: " + err);
                  }
                }
  
                boundary = buffer.indexOf("\n");
              }
  
              readStream(); 
            });
          };
  
          readStream();
        })
        .catch(error => observer.error(error));
    });
  }

  getHighEntropyExamples(projectId: number, topK: number = 5) {
    const url = this.apiService.getHighEntropyExamples(projectId, topK);
    return this.http.get<any[]>(url);
}


  markAsPromptExample(projectId: number, exampleId: string, label: number): Observable<any> {
    const url = this.apiService.annotatePromptExample(projectId, exampleId, label);
    return this.http.post(url, {});
  }

  getLabelMap(projectId: number): Observable<{ label_map: Record<number, string> }> {
    return this.http.get<{ label_map: Record<number, string> }>(
      this.apiService.getLabelMap(projectId)
    );
  }

  getExplanations(projectId: number, exampleId: string): Observable<string> {
  return this.http.get<string>(
      this.apiService.getExplanations(projectId, exampleId)
    );
  }
}
