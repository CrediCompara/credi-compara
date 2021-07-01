import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioPagosComponent } from './calendario-pagos.component';

describe('CalendarioPagosComponent', () => {
  let component: CalendarioPagosComponent;
  let fixture: ComponentFixture<CalendarioPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
