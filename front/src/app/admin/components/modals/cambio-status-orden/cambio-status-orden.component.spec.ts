import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioStatusOrdenComponent } from './cambio-status-orden.component';

describe('CambioStatusOrdenComponent', () => {
  let component: CambioStatusOrdenComponent;
  let fixture: ComponentFixture<CambioStatusOrdenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambioStatusOrdenComponent]
    });
    fixture = TestBed.createComponent(CambioStatusOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
