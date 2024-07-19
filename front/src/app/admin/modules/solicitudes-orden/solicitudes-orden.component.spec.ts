import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesOrdenComponent } from './solicitudes-orden.component';

describe('SolicitudesOrdenComponent', () => {
  let component: SolicitudesOrdenComponent;
  let fixture: ComponentFixture<SolicitudesOrdenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudesOrdenComponent]
    });
    fixture = TestBed.createComponent(SolicitudesOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
