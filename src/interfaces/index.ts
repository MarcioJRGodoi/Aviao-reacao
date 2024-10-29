export interface Plane {
    id: number;
    x: number;
    y: number;
    radius: number;
    angle: number;
    velocity: number;
    direction: number;
    color: string;
  }


  export interface Tracking {
    distance: number;
    plane?: Plane[]
    message?: string;
  }