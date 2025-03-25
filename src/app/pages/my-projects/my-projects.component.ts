import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyProjectsService } from 'src/app/services/my-projects.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface Project {
  id: number;
  name: string;
  labels: string[];
  textColumn: string;
  labelsColumn: string;
  annotated?: number;
  total?: number;
  createdAt: number;
}

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css']
})
export class MyProjectsComponent implements OnInit {
  isNewProjectPopupOpen = false;
  currentStep = 1;
  projects: Project[] = [];
  columnNames: string[] = [];
  uniqueLabels: string[] = [];

  newProject = {
    name: '',
    file: null as File | null,
    columnTextName: '',
    columnLabelName: '',
    availableLabels: ['']
  };

  constructor(
    private projectService: MyProjectsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  onFileSelected(file: File): void {
    this.newProject.file = file;
    this.fetchColumnNames();
  }

  fetchColumnNames(): void {
    if (!this.newProject.file) return;
    
    const formData = new FormData();
    formData.append('file', this.newProject.file);

    this.projectService.fetchColumns(formData).subscribe(
      response => {
        if (!response.columns.length) {
          this.toastr.error('', 'No columns names!', { timeOut: 5000 });
        }
        this.columnNames = response.columns;
      },
      error => {
        console.error('Błąd pobierania nazw kolumn:', error);
        this.toastr.error('', 'Error during fetching column names', { timeOut: 5000 });
      }
    );
  }

  fetchUniqueLabels(): void {
    if (!this.newProject.file || !this.newProject.columnLabelName) return;
    
    const formData = new FormData();
    formData.append('file', this.newProject.file);
    formData.append('column_name', this.newProject.columnLabelName);

    this.projectService.fetchUniqueLabels(formData).subscribe(
      response => {
        this.uniqueLabels = response.unique_values.length ? response.unique_values : ['Brak etykiet'];
        this.newProject.availableLabels = this.uniqueLabels;
      },
      error => {
        console.error('Błąd pobierania unikalnych etykiet:', error);
        this.toastr.error('', 'Error while fetching labels!', { timeOut: 5000 });
      }
    );
  }

  nextStep(): void {
    if (this.currentStep === 1 && (!this.newProject.file || !this.newProject.name)) {
      this.toastr.error('', 'Add name and file!', { timeOut: 5000 });
      return;
    }
    if (this.currentStep === 2 && (!this.newProject.columnTextName || !this.newProject.columnLabelName)) {
      this.toastr.error('', 'Add columns', { timeOut: 5000 });
      return;
    }
    if (this.currentStep === 2) {
      this.fetchUniqueLabels();
    }
    this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  addProject(): void {
    if (!this.newProject.name || !this.newProject.file || !this.newProject.columnTextName || !this.newProject.columnLabelName) {
      this.toastr.error('', 'Complete required fields', { timeOut: 5000 });
      return;
    }
  
    const formData = new FormData();
    

  
    formData.append('name', this.newProject.name);
    formData.append('file', this.newProject.file!);
    formData.append('column_text_name', this.newProject.columnTextName);
    formData.append('column_label_name', this.newProject.columnLabelName);
    formData.append('available_labels', JSON.stringify(this.newProject.availableLabels));
    console.log(JSON.stringify(this.newProject.availableLabels))
  
    for (let pair of (formData as any).entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    this.projectService.addProject(formData).subscribe(
      () => {
        this.toastr.success('', 'The project has been added.', { timeOut: 2000 });
        this.loadProjects();
        this.closeModal();
        this.newProject = {
          name: '',
          file: null as File | null,
          columnTextName: '',
          columnLabelName: '',
          availableLabels: ['']
        };
      },
      error => {
        this.toastr.error('', 'Error while creating project', { timeOut: 5000 });
      }
    );
  }
  
  

  loadProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects.map(project => ({
        id: project.id,
        name: project.name,
        labels: this.parseLabels(project.available_labels),
        textColumn: project.column_text_name,
        labelsColumn: project.column_label_name,
        annotated: project.number_annotated_data,
        total: project.row_count || 0,
        createdAt: project.created_at,
      }));

      console.log(this.projects)
    });

   
  }


  parseLabels(labels: any): string[] {
    try {
    
      const firstParse = JSON.parse(labels);
      const secondParse = JSON.parse(firstParse);
  
      return Array.isArray(secondParse) ? secondParse : [];
    } catch (error) {
      console.error('Błąd parsowania etykiet:', error);
      return [];
    }
  }
  
  

  openModal(): void {
    this.isNewProjectPopupOpen = true;
    this.currentStep = 1;
  }

  closeModal(): void {
    this.isNewProjectPopupOpen = false;
  }

  annotateProject(id: number): void {
    this.router.navigate([`/my-projects/${id}/annotate`]);
  }

  deleteProject(projectId: number): void {

      this.projectService.deleteProject(projectId).subscribe(
        () => {
          this.toastr.success('', 'The project has been deleted.', { timeOut: 2000 });
          this.loadProjects();
        },
        error => {
          console.error('Błąd podczas usuwania projektu:', error);
          this.toastr.error('', 'Error while deleting', { timeOut: 5000 });
        }
      );

  }

  changeProjectName(name: string): void {
    this.newProject.name = name;
  }
}
