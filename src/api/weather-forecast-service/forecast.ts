import { IForecastDataPoint } from "./IForecastDataPoint";

export class Forecast {

  public getLocation(): string {
    return this.city + ", " + this.country;
  }

  public getDataPoints(): IForecastDataPoint[] {
    return this.dataPoints;
  }

  constructor(private city: string, private country: string, private dataPoints: IForecastDataPoint[]) { }
}
