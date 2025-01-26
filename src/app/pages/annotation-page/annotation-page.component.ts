import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyProjectsService } from 'src/app/services/my-projects.service';

interface Project {
  id: number;
  name: string;
  labels: string;
  textColumn: string;
  labelsColumn: string;
  lastAnnotatedIndex?: number;
}

@Component({
  selector: 'app-annotation-page',
  templateUrl: './annotation-page.component.html',
  styleUrls: ['./annotation-page.component.css']
})
export class AnnotationPageComponent implements OnInit {
  project!: Project;
  annotatedData: any[] = [];
  loading = false;

  constructor(private route: ActivatedRoute, private projectService: MyProjectsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProjectById(id).subscribe((response: any) => {
      this.project = {
        id: response.id,
        name: response.name,
        textColumn: response.column_text_name,
        labelsColumn: response.column_label_name,
        labels: response.available_labels,
        lastAnnotatedIndex: response.last_annotated_index
      };

      // Pobierz dane anotacji od początku do zaanotowanego indeksu
      this.loadAnnotatedData();
    });
  }

  loadAnnotatedData() {
    if (!this.project) return;
    this.projectService.getAnnotatedData(this.project.id).subscribe(
      (data: any) => {
        this.annotatedData = data.slice(0, this.project.lastAnnotatedIndex);
      },
      error => {
        console.error('Błąd podczas pobierania danych anotacji:', error);
      }
    );
  }

  annotatePartially(limit: number) {
    if (!this.project) return;
    this.loading = true;
    this.projectService.annotateProject(this.project.id, limit).subscribe(
      response => {
        console.log('Anotacja zakończona:', response.results);
        this.annotatedData = [...this.annotatedData, ...response.results];
        if (this.project && this.project.lastAnnotatedIndex !== undefined) {
          this.project.lastAnnotatedIndex += limit;
        } else {
          console.warn('Nie można zaktualizować indeksu anotacji, ponieważ projekt nie został jeszcze załadowany.');
        }

        this.loading = false;
      },
      error => {
        console.error('Błąd podczas anotacji:', error);
        alert('Wystąpił błąd podczas anotacji.');
        this.loading = false;
      }
    );
  }

  downloadAnnotatedFile() {
    if (!this.project) return;
  
    this.projectService.downloadAnnotatedFile(this.project.id).subscribe(response => {
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated_project_${this.project.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Błąd podczas pobierania pliku:', error);
      alert('Nie udało się pobrać pliku.');
    });
  }
}
