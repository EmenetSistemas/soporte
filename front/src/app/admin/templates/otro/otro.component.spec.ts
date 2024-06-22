import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtroComponent } from './otro.component';

describe('OtroComponent', () => {
  let component: OtroComponent;
  let fixture: ComponentFixture<OtroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtroComponent]
    });
    fixture = TestBed.createComponent(OtroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
