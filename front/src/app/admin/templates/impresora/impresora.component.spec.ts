import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresoraComponent } from './impresora.component';

describe('ImpresoraComponent', () => {
  let component: ImpresoraComponent;
  let fixture: ComponentFixture<ImpresoraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImpresoraComponent]
    });
    fixture = TestBed.createComponent(ImpresoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
