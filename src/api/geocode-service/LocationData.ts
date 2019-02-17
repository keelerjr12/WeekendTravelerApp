export class LocationData {

  getLat(): number {
     return this.lat;
  }
  getLng(): number {
     return this.lng;
  }

  constructor(private lat: number, private lng: number) { }
}
