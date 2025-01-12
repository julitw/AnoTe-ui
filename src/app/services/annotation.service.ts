import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {

  selectedFile: File | null = null;
  selectedColumn: string | null = null;
  labels: string[] = [];

  private csvData: any[] = []; // Parsed CSV data

  private _limit = new BehaviorSubject<number>(10);
  private _index = new BehaviorSubject<number>(0);  

  constructor(private http: HttpClient) {}

  get limit() {
    return this._limit.asObservable();
  }

  setLimit(value: number) {
    this._limit.next(value);
  }


  get index() {
    return this._index.asObservable();
  }

  setIndex(value: number) {
    this._index.next(value);
  }



  setProjectData(selectedFile: File, selectedColumn: string, labels: string[]){
    this.selectedFile = selectedFile;
    this.selectedColumn = selectedColumn;
    this.labels = labels;

  }

  generateAnnotations(): Observable<any> | null {
    console.log(this.selectedFile , this.labels, this.selectedColumn )
    if (!this.selectedFile || !this.labels || !this.selectedColumn) {
      console.error('Brak wymaganych danych do wygenerowania adnotacji.');
      return null;
    }


    const currentIndex = this._index.getValue();
    const currentLimit = this._limit.getValue();

    const formData = new FormData();
    formData.append('labels', this.labels.join(','));
    formData.append('column_name_text', this.selectedColumn);
    formData.append('file', this.selectedFile);
    formData.append('index', (currentIndex).toString()); 
    formData.append('limit', (currentLimit).toString()); 

    // Zwrócenie obserwowalnego obiektu
    return this.http.post('http://127.0.0.1:8000/upload/', formData);
    }
  }
