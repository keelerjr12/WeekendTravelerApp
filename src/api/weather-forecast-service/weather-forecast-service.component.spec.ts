import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherForecastServiceComponent } from './weather-forecast-service.component';

describe('WeatherForecastServiceComponent', () => {
  let component: WeatherForecastServiceComponent;
  let fixture: ComponentFixture<WeatherForecastServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherForecastServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherForecastServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
