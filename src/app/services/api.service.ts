import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;


  readonly projects = `${this.baseUrl}/projects`;
  readonly addProject = `${this.baseUrl}/projects/add`;
  readonly getColumns = `${this.baseUrl}/projects/get_columns`;
  readonly getUniqueValues = `${this.baseUrl}/projects/get_unique_values`;

  getProjectById(id: number): string {
    return `${this.baseUrl}/projects/${id}`;
  }

  annotateProject(id: number, limit: number): string {
    return `${this.baseUrl}/projects/${id}/annotate?limit=${limit}`;
  }

  downloadAnnotatedFile(id: number): string {
    return `${this.baseUrl}/projects/${id}/download`;
  }

  getProjectData(id: number): string {
    return `${this.baseUrl}/projects/${id}/project-data`;
  }

  deleteProject(id: number): string {
    return `${this.baseUrl}/projects/${id}`;
  }

  setTrueLabel(id: number, exampleId: string, label: string){
    return `${this.baseUrl}/projects/${id}/add-true-label?exampleId=${exampleId}&label=${label}`;
  }

  getNextAnnotatedId(id: number, limit: number){
    return `${this.baseUrl}/projects/${id}/get-next-annotated-ids?limit=${limit}`
  }
}
