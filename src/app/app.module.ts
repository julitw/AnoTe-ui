import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importuj FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationPageComponent } from './pages/annotation-page/annotation-page.component'; // Dodaj ten import

@NgModule({
  declarations: [
    AppComponent,
    UploadPageComponent,
    AnnotationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
