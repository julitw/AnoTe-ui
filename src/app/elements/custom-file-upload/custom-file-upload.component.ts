import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.css']
})
export class CustomFileUploadComponent {

  @Output() fileSelected = new EventEmitter<File>();
  fileName: string = '';

  onFileSelected(event: any) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file) {
        this.fileName = file.name;
        this.fileSelected.emit(file);
      }
    }
   
  }

}
