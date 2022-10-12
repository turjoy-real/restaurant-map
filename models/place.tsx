export class Place {
  title: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  rating: number;
  id: string;

  constructor(
    title: string,
    imageUrl: string,
    location: { lat: number; lng: number },
    rating: number,
    id: string
  ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.location = { lat: location.lat, lng: location.lng };
    this.rating = rating;
    this.id = id;
  }
}