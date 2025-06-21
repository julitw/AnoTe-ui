import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MyProjectsService } from 'src/app/services/my-projects.service';

interface Project {
  id: number;
  name: string;
  labels: string[];
  textColumn: string;
  labelsColumn: string;
  lastAnnotatedIndex?: number;
  number_evaluated_data: number
  number_positive_evaluated_data: number
  number_annotated_data: number
  total: number;
}

interface EvalutedExample {
  id: string | null;
  trueLabel: string | null;
}

@Component({
  selector: 'app-annotation-page',
  templateUrl: './annotation-page.component.html',
  styleUrls: ['./annotation-page.component.css'],
  animations: [
    trigger('numberChange', [
      transition(':increment, :decrement', [
        animate(
          '0.5s ease-out',
          keyframes([
            style({ transform: 'translateY(-100%)', opacity: 0, offset: 0 }),
            style({ transform: 'translateY(0)', opacity: 1, offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})

export class AnnotationPageComponent implements OnInit {
  project!: Project;
  annotatedData: any[] = [];
  loading = false;
  isFirstDataLoaded = false;
  limit = 10;
  evaluatedExample: EvalutedExample = {id: null, trueLabel: null}
  clickedIcon: 'success' | 'failure' | null = null;
  currentlyAnotatedIds : string[] = [];
  projectId!: number;
  dropdownOpen: boolean = false;
  limitOptions: number[] = [10, 20, 30];
  highEntropyExamples: any[] = [];


  @ViewChild('tableContainer') tableContainer!: ElementRef;

  constructor(private route: ActivatedRoute, private projectService: MyProjectsService, private toastr: ToastrService,
    private el: ElementRef, private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));

    this.projectService.getProjectById(this.projectId).subscribe((response: any) => {
      this.project = {
        id: response.id,
        name: response.name,
        textColumn: response.column_text_name,
        labelsColumn: response.column_label_name,
        labels: this.parseLabels(response.available_labels),
        lastAnnotatedIndex: response.last_annotated_index,
        number_evaluated_data: response.number_evaluated_data || 0,
        number_positive_evaluated_data: response.number_positive_evaluated_data || 0,
        number_annotated_data: response.number_annotated_data || 0,
        total: response.total || 0

      };

      this.loadAnnotatedData();
      this.loadHighEntropyExamples()    });
  }

  getProject(){
    this.projectService.getProjectById(this.projectId).subscribe((response: any) => {
      this.project = {
        id: response.id,
        name: response.name,
        textColumn: response.column_text_name,
        labelsColumn: response.column_label_name,
        labels: this.parseLabels(response.available_labels),
        lastAnnotatedIndex: response.last_annotated_index,
        number_evaluated_data: response.number_evaluated_data,
        number_positive_evaluated_data: response.number_positive_evaluated_data,
        number_annotated_data: response.number_annotated_data,
        total: response.total
      }})
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
    this.projectService.getProjectData(this.project.id).subscribe(
      (data: any) => {
        this.annotatedData = data.map((item:any) => ({
          ...item,
          evaluated_label_by_user: item.evaluated_label_by_user === 'nan' || item.evaluated_label_by_user === null ? "" : item.evaluated_label_by_user,
          predicted_label_by_llm: item.predicted_label_by_llm === 'nan' || item.predicted_label_by_llm === null ? "" : item.predicted_label_by_llm,
          label: item.label === 'nan' || item.label === null ? "" : item.label,
        }));
      },
      error => {
        console.error('Błąd podczas pobierania danych anotacji:', error);
      }
    );
  }

  startAnnotation(){
    if (!this.project) return;

    this.projectService.getNextAnnotatedIds(this.project.id, this.limit).subscribe(
      (response: { message: string, updated_ids: string[] }) => {
        this.currentlyAnotatedIds = response.updated_ids;
        this.scrollToBlinking()
        this.annotatePartially()

      },
      (error) => {
        this.toastr.error('', error.error.detail, { timeOut: 5000 });
      }
    )
  }
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectLimit(limit: number): void {
    this.limit = limit;
    this.dropdownOpen = false; // Zamknij dropdown po wyborze
  }


  annotatePartially(){
    this.projectService.annotateProject(this.project.id, this.limit).subscribe({
      next: (data) => {
        console.log('Received:', data);
        const index = this.annotatedData.findIndex((el => {
            return el.id === data.id
        }))
  
        if(index){
            this.annotatedData[index].predicted_label_by_llm = data.response
            this.currentlyAnotatedIds = this.currentlyAnotatedIds.filter(item => item !== data.id);
            this.project.number_annotated_data = this.project.number_annotated_data + 1;
            this.scrollToBlinking()
        }
      },
      error: (error) => console.error('Streaming error:', error),
      complete: () => {
        this.toastr.success('', 'Annotation has been completed!', { timeOut: 5000 });
        this.currentlyAnotatedIds = []
        this.loadHighEntropyExamples()
      }
    })
  }

  scrollToBlinking(): void {
    setTimeout(() => {
      const blinkingElement = this.el.nativeElement.querySelector('.blinking');
      if (blinkingElement) {
        blinkingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      this.toastr.error('', error.error.detail, { timeOut: 5000 });
    });
  }


  openLabelsOptions(i: string){
    this.evaluatedExample.id = i;
    this.clickedIcon = 'failure'

  }

  setTrueLabel(label: string, i: string | null = null){
    if(i !== null){ 
      this.evaluatedExample.id = i;
    }
    this.evaluatedExample.trueLabel = label;
    
    if(
      this.project.id &&
      this.evaluatedExample.id !== null && 
      this.evaluatedExample.trueLabel
    ){
      this.projectService.setTrueLabel(this.project.id, this.evaluatedExample.id, label).subscribe(
        response => {
          if (this.evaluatedExample.id !== null) { 
            const index = this.annotatedData.findIndex(item => {return item.id === this.evaluatedExample.id} )
            this.annotatedData[index].evaluated_label_by_user = label;
          }
          this.evaluatedExample = {id: null, trueLabel: null};
          this.clickedIcon = null;
          this.getProject()
          this.toastr.success('Evaluation has been completed!','' , { timeOut: 1000 });
        },
        error => {
          this.toastr.error('', error.error.detail, { timeOut: 5000 });
        }
      );
    }
  }

  loadHighEntropyExamples() {
    if (!this.project) return;

    this.projectService.getHighEntropyExamples(this.project.id, 5).subscribe({
      next: (data: any[]) => {
        this.highEntropyExamples = data;
      },
      error: (error) => {
        console.error('Błąd podczas pobierania przykładów o najwyższej entropii:', error);
        this.toastr.error('Nie udało się pobrać przykładów do selekcji', '', { timeOut: 3000 });
      }
    });
  }

  markAsSelectedPromptExample(exampleId: string, label: string) {
  this.projectService.markAsPromptExample(this.projectId, exampleId, label).subscribe(
    () => {
      this.toastr.success('Marked as prompt example!');
      this.highEntropyExamples = this.highEntropyExamples.filter(ex => ex.id !== exampleId);
    },
    (error) => {
      this.toastr.error('Failed to mark as prompt example');
    }
    );
  }

  
}
