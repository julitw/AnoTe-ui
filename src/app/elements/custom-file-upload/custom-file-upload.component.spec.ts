import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFileUploadComponent } from './custom-file-upload.component';

describe('CustomFileUploadComponent', () => {
  let component: CustomFileUploadComponent;
  let fixture: ComponentFixture<CustomFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomFileUploadComponent]
    });
    fixture = TestBed.createComponent(CustomFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
