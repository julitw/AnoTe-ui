import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importuj FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationPageComponent } from './pages/annotation-page/annotation-page.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component';
import { CustomInputComponent } from './elements/custom-input/custom-input.component';
import { CustomDropdownComponent } from './elements/custom-dropdown/custom-dropdown.component';
import { CustomFileUploadComponent } from './elements/custom-file-upload/custom-file-upload.component'; // Dodaj ten import
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    AnnotationPageComponent,
    MyProjectsComponent,
    CustomInputComponent,
    CustomDropdownComponent,
    CustomFileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 0, // ⏳ Nie zamyka się automatycznie
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
