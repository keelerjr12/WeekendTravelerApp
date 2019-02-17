import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsochroneMapComponent } from './isochrone-map.component';

describe('IsochroneMapComponent', () => {
  let component: IsochroneMapComponent;
  let fixture: ComponentFixture<IsochroneMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsochroneMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsochroneMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
