import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent {
  
  messages: { sender: string, text: string }[] = [
    { sender: 'system', text: 'Proszę wgrać plik CSV.' }, 
    { sender: 'user', text: 'Mój plik csv to ' }, 
  ];
  selectedFile: File | null = null;
  columnNames: string[] = [];
  selectedColumn: string | null = null;
  labels: string[] = [];
  newLabel: string = '';


  constructor(private http: HttpClient){

  }

  onFileUpload(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvContent = e.target.result;
        this.parseCsv(csvContent);
      };
      reader.readAsText(this.selectedFile);
    }
  }

  parseCsv(content: string): void {
    const lines = content.split('\n');
    if (lines.length > 0) {
      this.columnNames = lines[0].split(',');
      this.messages.push({ sender: 'system', text: 'Proszę wskazać nazwę kolumny, w której jest tekst.' });
      this.messages.push({sender: 'user', text: 'Ta kolumna to'})
    } else {
      this.messages.push({ sender: 'system', text: 'Nie udało się odczytać pliku CSV.' });
    }
  }

  selectColumn(): void {
    if (this.selectedColumn && this.columnNames.includes(this.selectedColumn.trim())) {
      this.messages.push({ sender: 'system', text: `Wybrano kolumnę: ${this.selectedColumn}` });
      this.messages.push({ sender: 'system', text: 'Podaj etykiety, jakimi chcesz oznaczać dane.' });
      this.messages.push({ sender: 'user', text: 'Moje etykiety to ' });
    } else {
      this.messages.push({ sender: 'system', text: `Kolumna "${this.selectedColumn}" nie istnieje w pliku CSV.` });
    }
  }

  setMessageClass(i: number){
    return `message ${this.messages[i].sender}`
  }

  addLabelField(): void {
    this.labels.push('');
  }

  updateLabel(index: number, value: string): void {
    this.labels[index] = value;
  }
  trackByIndex(index: number, item: string): number {
    return index;
  }
  

  finalizeLabels(): void {
    console.log(this.labels)
    const validLabels = this.labels.filter(label => label.trim() !== '');
    if (validLabels.length > 0) {
      this.messages.push({ sender: 'user', text: `Dodano etykiety: ${validLabels.join(', ')}` });
      this.generateAnnotations()
      this.labels = [];
    } else {
      this.messages.push({ sender: 'system', text: 'Nie podano żadnych etykiet. Proszę spróbować ponownie.' });
    }
  }

  generateAnnotations(){
    const formData = new FormData();
    if(!this.selectedFile || !this.labels || !this.selectedColumn ) return;

    formData.append('file', this.selectedFile); 
    formData.append('labels', this.labels.join(',')); 
    formData.append('column_name_text', this.selectedColumn);

    this.http.post('http://127.0.0.1:8000/upload/', formData).subscribe(
      (response) => {
        console.log('Success:', response);
        this.messages.push({ sender: 'system', text: 'Poprawnie wysłano dane' });
      },
      (error) => {
        console.error('Error:', error);
        this.messages.push({ sender: 'system', text: 'Wystąpił problem z przesłaniem danych' });
      }
    );
  }

}
