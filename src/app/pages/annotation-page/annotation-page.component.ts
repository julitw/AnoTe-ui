import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyProjectsService } from 'src/app/services/my-projects.service';

interface Project {
  id: number;
  name: string;
  labels: string[];
  textColumn: string;
  labelsColumn: string;
  lastAnnotatedIndex?: number;
}

interface EvalutedExample {
  index: number | null;
  trueLabel: string | null;
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
  isFirstDataLoaded = false;
  limit = 10;
  checkingMode = false;
  labels = ['fdfd', 'dsds', 'fdfd', 'fdfdf']
  evaluatedExample: EvalutedExample = {index: null, trueLabel: null}
  evaluatedExamplesList: EvalutedExample[] = [];
  clickedIcon: 'success' | 'failure' | null = null;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  constructor(private route: ActivatedRoute, private projectService: MyProjectsService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProjectById(id).subscribe((response: any) => {
      this.project = {
        id: response.id,
        name: response.name,
        textColumn: response.column_text_name,
        labelsColumn: response.column_label_name,
        labels: this.parseLabels(response.available_labels),
        lastAnnotatedIndex: response.last_annotated_index,
      };

      this.loadAnnotatedData();
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

  loadAnnotatedData() {
    if (!this.project) return;
    this.projectService.getAnnotatedData(this.project.id).subscribe(
      (data: any) => {
        this.annotatedData = data.slice(0, this.project.lastAnnotatedIndex).map((item:any) => ({
          ...item,
          true_label: item.true_label === 'nan' || item.true_label === null ? "" : item.true_label
        }));
      },
      error => {
        console.error('Błąd podczas pobierania danych anotacji:', error);
      }
    );
  }

  annotatePartially() {
    if (!this.project) return;
    this.loading = true;
    this.projectService.annotateProject(this.project.id, this.limit).subscribe(
      response => {
        console.log('Anotacja zakończona:', response.results);

        this.annotatedData = [...this.annotatedData, ...response.results];

        if (this.project && this.project.lastAnnotatedIndex !== undefined) {
          this.project.lastAnnotatedIndex = response.last_index;
        } else {
          console.warn('Nie można zaktualizować indeksu anotacji, ponieważ projekt nie został jeszcze załadowany.');
        }

        this.loading = false;
        this.scrollToBottom(); 
        this.isFirstDataLoaded = true;
      },
      error => {
        console.error('Błąd podczas anotacji:', error);
        alert('Wystąpił błąd podczas anotacji.');
        this.loading = false;
      }
    );
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.tableContainer) {
        this.tableContainer.nativeElement.scrollTop = this.tableContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  getHighlightedClass(index: number): string {
    const total = this.annotatedData.length;
    return index >= total - this.limit ? 'new-annotation' : '';
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

  checkAnnotation(){
  }

  openLabelsOptions(i: number){
    this.evaluatedExample.index = i;
    this.clickedIcon = 'failure'

  }

  setTrueLabel(label: string, i: number | null = null){
    if(i !== null){ 
      this.evaluatedExample.index = i;
    }
    this.evaluatedExample.trueLabel = label;
    this.evaluatedExamplesList.push({...this.evaluatedExample})
    console.log('ok', this.evaluatedExample)
    
    if(
      this.project.id &&
      this.evaluatedExample.index !== null && 
      this.evaluatedExample.trueLabel
    ){
      this.projectService.setTrueLabel(this.project.id, this.evaluatedExample.index, label).subscribe(
        response => {
          if (this.evaluatedExample.index !== null) { 
            this.annotatedData[this.evaluatedExample.index].true_label = label;
          }
          this.evaluatedExample = {index: null, trueLabel: null};
          this.clickedIcon = null;
          alert('Zaktualizowano label');
        },
        error => {
          alert(error);
        }
      );
    }
  }
  
}
