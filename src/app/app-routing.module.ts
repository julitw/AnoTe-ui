import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { AnnotationPageComponent } from './pages/annotation-page/annotation-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/upload', pathMatch: 'full'},
  {path: 'upload', component: UploadPageComponent},
  {path: 'annotate', component: AnnotationPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
