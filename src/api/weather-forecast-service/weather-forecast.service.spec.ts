import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherForecastService } from './weather-forecast.service';

describe('WeatherForecastService', () => {
  let component: WeatherForecastService;
  let fixture: ComponentFixture<WeatherForecastService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherForecastService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherForecastService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
