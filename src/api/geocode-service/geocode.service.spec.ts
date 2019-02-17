import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeocodeServiceComponent } from './geocode-service.component';

describe('GeocodeServiceComponent', () => {
  let component: GeocodeServiceComponent;
  let fixture: ComponentFixture<GeocodeServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeocodeServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocodeServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
