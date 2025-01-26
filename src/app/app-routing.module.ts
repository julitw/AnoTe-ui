import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnotationPageComponent } from './pages/annotation-page/annotation-page.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component';

const routes: Routes = [
  { path: 'my-projects', component: MyProjectsComponent },
  {path: 'my-projects/:id/annotate', component: AnnotationPageComponent},
  { path: '', redirectTo: '/my-projects', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
