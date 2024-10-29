// LogicService.ts

import type { Plane, Tracking } from "../interfaces";

export class LogicService {
  polarToCartesian(distance: number, angle: number): [number, number] {
    const radians = (angle * Math.PI) / 180;
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);

    return [distance * cos, distance * sin];
  }

  move(planes: { x: number; y: number }[], x: number, y: number) {
    return planes.map((plane) => ({
      ...plane,
      x: plane.x + x,
      y: plane.y + y,
    }));
  }

  rotate(planes: Plane[], angle: number, xOrigin: number, yOrigin: number) {
    const resultPlanes: typeof planes = [];
    const radians = angle * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    for (const plane of planes) {
      const xRelative = plane.x - xOrigin;
      const yRelative = plane.y - yOrigin;
      const xFinal = xRelative * cos - yRelative * sin;
      const yFinal = yRelative * cos + xRelative * sin;

      resultPlanes.push({
        x: xFinal + xOrigin,
        y: yFinal + yOrigin,
        id: plane.id,
        radius: plane.radius,
        angle: plane.angle,
        velocity: plane.velocity,
        direction: plane.direction,
        color: plane.color,
      });
    }

    return resultPlanes;
  }

  staggerDecimal(planes: { x: number; y: number }[], x: number, y: number) {
    return planes.map((plane) => ({
      ...plane,
      x: plane.x * x,
      y: plane.y * y,
    }));
  }

  planesClosestToAirport(
    airport: { x: number; y: number },
    planes: { x: number; y: number }[],
    minimumDistance: number
  ) {
    return planes
      .map((plane) => ({
        plane,
        distance: this.distanceBetweenTwoPoints(airport.x, airport.y, plane.x, plane.y),
      }))
      .filter((item) => item.distance <= minimumDistance);
  }

  planesClosestToPlanes(planes: { x: number; y: number }[], minimumDistance: number) {
    const closestPlanes: { plane: { x: number; y: number }[]; distance: number }[] = [];

    for (let i = 0; i < planes.length; i++) {
      for (let j = i + 1; j < planes.length; j++) {
        const distance = this.distanceBetweenTwoPoints(planes[i].x, planes[i].y, planes[j].x, planes[j].y);
        if (distance <= minimumDistance) {
          closestPlanes.push({ plane: [planes[i], planes[j]], distance });
        }
      }
    }

    return closestPlanes;
  }

  calculatedFinishPoint(plane: { x: number; y: number; velocity: number; direction: number }, time: number) {
    const distance = time * plane.velocity;
    const radians = (plane.direction * Math.PI) / 180;
    const x = plane.x + distance * Math.sin(radians);
    const y = plane.y + distance * Math.cos(radians);

    return { x, y };
  }

  calculateFX(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    const a = (p1.y - p2.y) / (p1.x - p2.x);
    const b = p1.y - a * p1.x;
    return { a, b };
  }

  calculateIntersectionPoint(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number }
  ) {
    const f1 = this.calculateFX(p1, p2);
    const f2 = this.calculateFX(p3, p4);
    const x = (f2.b - f1.b) / (f1.a - f2.a);
    const y = f1.a * x + f1.b;

    return { x, y };
  }

  calculateTiming(p1: { x: number; y: number }, p2: { x: number; y: number }, velocity: number) {
    return this.distanceBetweenTwoPoints(p1.x, p1.y, p2.x, p2.y) / velocity;
  }

  planesInCollisionRoute({ minimumTime, planes }: { planes: Plane[]; minimumTime: number }): Tracking[] {
    const collisionPlanes: Tracking[] = [];

    for (let i = 0; i < planes.length; i++) {
      const planeI = planes[i];
      const pi2 = this.calculatedFinishPoint(planeI, minimumTime);

      for (let j = i + 1; j < planes.length; j++) {
        const planeJ = planes[j];
        const pj2 = this.calculatedFinishPoint(planeJ, minimumTime);
        const intersectionPoint = this.calculateIntersectionPoint(planeI, pi2, planeJ, pj2);

        if (intersectionPoint) {
          const t1 = this.calculateTiming(planeI, intersectionPoint, planeI.velocity);
          const t2 = this.calculateTiming(planeJ, intersectionPoint, planeJ.velocity);

          console.log("Timings:", t1, t2)
          const epsilon = 0.001;
          // if (Math.abs(t1 - t2) < epsilon && t1 <= minimumTime && t2 <= minimumTime) {
            collisionPlanes.push({ plane: [planeI, planeJ], distance: t1 });
          // }
        }
      }
    }

    return collisionPlanes;
  }

  distanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    const xDiff = x1 - x2;
    const yDiff = y1 - y2;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  to360Scale(angle: number) {
    return angle % 360;
  }
}

export default new LogicService();
