import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importuj FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AnnotationPageComponent } from './pages/annotation-page/annotation-page.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component'; // Dodaj ten import

@NgModule({
  declarations: [
    AppComponent,
    AnnotationPageComponent,
    MyProjectsComponent
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
