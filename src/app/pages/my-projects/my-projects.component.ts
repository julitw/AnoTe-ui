import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyProjectsService } from 'src/app/services/my-projects.service';


interface Project {
  id: number;
  name: string;
  labels: string;
  textColumn: string;
  labelsColumn: string;
  annotated?: number;
  total?: number ;
}


@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {

  projects: Project[] = []

  newProject = {
    name: '',
    file: null,
    columnTextName: '',
    columnLabelName: '',
    availableLabels: ['']
  };

  constructor(private projectService: MyProjectsService, private router: Router ){
  }

  ngOnInit(): void {
    this.loadProjects()
  }

  onFileSelected(event: any) {
    this.newProject.file = event.target.files[0];
  }

  addLabelField() {
    this.newProject.availableLabels.push('');
  }

  addProject() {
    this.projectService.addProject(this.newProject).subscribe(response => {
      alert('Projekt dodany pomyślnie!');
      this.loadProjects();
    });
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(projects => {
      console.log(projects)
      projects.forEach((project) => {
        this.projects.push({
          id: project.id,
          name: project.name ,
          labels: project.available_labels,
          textColumn: project.column_text_name,
          labelsColumn: project.column_label_name,
          annotated: 0,
          total: 0
        })
      })
    });
  }

  updateLabel(index: number, event: any) {
    this.newProject.availableLabels[index] = event.target.value;
  }
  trackByIndex(index: number, item: any): number {
    return index;
  }

  annotateProject(id: number) {
    this.router.navigate([`/my-projects/${id}/annotate`]);
  }

  deleteProject(projectId: number) {
  
    if (confirm(`Czy na pewno chcesz usunąć projekt`)) {
      this.projectService.deleteProject(projectId).subscribe(
        response => {
          alert('Projekt został usunięty.');
          window.location.href = '/my-projects';  // Przekierowanie na stronę listy projektów
        },
        error => {
          console.error('Błąd podczas usuwania projektu:', error);
          alert('Nie udało się usunąć projektu.');
        }
      );
    }
  }
  
  
  

}
