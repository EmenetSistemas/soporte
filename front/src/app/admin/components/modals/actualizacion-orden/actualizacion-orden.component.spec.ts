import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizacionOrdenComponent } from './actualizacion-orden.component';

describe('ActualizacionOrdenComponent', () => {
  let component: ActualizacionOrdenComponent;
  let fixture: ComponentFixture<ActualizacionOrdenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizacionOrdenComponent]
    });
    fixture = TestBed.createComponent(ActualizacionOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
