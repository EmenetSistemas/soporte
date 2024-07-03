import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrdenPdfComponent } from './modal-orden-pdf.component';

describe('ModalOrdenPdfComponent', () => {
  let component: ModalOrdenPdfComponent;
  let fixture: ComponentFixture<ModalOrdenPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalOrdenPdfComponent]
    });
    fixture = TestBed.createComponent(ModalOrdenPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
