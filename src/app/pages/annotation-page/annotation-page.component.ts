import { Component } from '@angular/core';
import { AnnotationService } from 'src/app/services/annotation.service';

@Component({
  selector: 'app-annotation-page',
  templateUrl: './annotation-page.component.html',
  styleUrls: ['./annotation-page.component.css']
})
export class AnnotationPageComponent {
  limit: number = 10;
  index: number = 0;

  annotatedData: any[] = [];
  isLoading: boolean = false; 

  constructor(private annotationService: AnnotationService) {}

  ngOnInit() {
    this.annotationService.limit.subscribe((value) => {
      this.limit = value;
    });

    this.annotationService.index.subscribe((value) => {
      this.index = value;
    });

    this.onGenerateAnnotations();
  }

  updateLimit(newLimit: number) {
    this.annotationService.setLimit(newLimit);
  }

  updateIndex(newIndex: number) {
    this.annotationService.setIndex(newIndex);
  }

  onNextIndex() {
    this.updateIndex(this.index + 1);
    this.onGenerateAnnotations();
  }

  onGenerateAnnotations() {
    this.isLoading = true; 
    const annotationRequest = this.annotationService.generateAnnotations();

    if (annotationRequest) {
      annotationRequest.subscribe(
        (response: any) => {
          console.log('Sukces:', response);
          this.annotatedData.push(...response['results']);
          console.log(this.annotatedData);
          this.isLoading = false; 
        },
        (error: any) => {
          console.error('Błąd:', error);
          this.isLoading = false; 
        }
      );
    } else {
      this.isLoading = false; 
    }
  }
}
