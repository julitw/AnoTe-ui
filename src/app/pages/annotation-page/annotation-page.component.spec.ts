import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationPageComponent } from './annotation-page.component';

describe('AnnotationPageComponent', () => {
  let component: AnnotationPageComponent;
  let fixture: ComponentFixture<AnnotationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationPageComponent]
    });
    fixture = TestBed.createComponent(AnnotationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
