// LogicService.ts

import type { Plane, Tracking } from "../interfaces";

export class LogicService {
  polarToCartesian(distance: number, angle: number): [number, number] {
    const radians = (angle * Math.PI) / 180;
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);

    return [distance * cos, distance * sin];
  }

  move(planes: Plane[], x: number, y: number) {
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

  staggerDecimal(planes: Plane[], x: number, y: number) {
    return planes.map((plane) => ({
      ...plane,
      x: plane.x * x,
      y: plane.y * y,
    }));
  }

  planesClosestToAirport(
    airport: { x: number; y: number },
    planes: Plane[],
    minimumDistance: number
  ) {
    return planes
      .map((plane) => ({
        plane,
        distance: this.distanceBetweenTwoPoints(airport.x, airport.y, plane.x, plane.y),
        message: `Aviao ${plane.id} Distancia do Aeroporto: ${this.distanceBetweenTwoPoints(airport.x, airport.y, plane.x, plane.y).toFixed(2)} Km`
      }))
      .filter((item) => item.distance <= minimumDistance) as unknown as Tracking[];

  }

  planesClosestToPlanes(planes: Plane[], minimumDistance: number): Tracking[] {
    const closestPlanes: Tracking[] = [];

    for (let i = 0; i < planes.length; i++) {
      for (let j = i + 1; j < planes.length; j++) {
        const distance = this.distanceBetweenTwoPoints(planes[i].x, planes[i].y, planes[j].x, planes[j].y);
        if (distance <= minimumDistance) {
          closestPlanes.push({ plane: [planes[i], planes[j]], distance, message: `Avioes Proximos Distancia: ${distance.toFixed(2)} Km` });
        }
      }
    }

    return closestPlanes;
  }

  calculatedFinishPoint(plane: Plane, time: number) {
    const distance = time * plane.velocity;
    const radians = (plane.direction * Math.PI) / 180;
    const x = plane.x + distance * Math.sin(radians);
    const y = plane.y + distance * Math.cos(radians);

    return { x, y };
  }

  calculateFX(p1: Plane, p2: { x: number; y: number }) {
    const a = (p1.y - p2.y) / (p1.x - p2.x);
    const b = p1.y - a * p1.x;
    return { a, b };
  }

  calculateIntersectionPoint(
    p1: Plane,
    p2: { x: number; y: number },
    p3: Plane,
    p4: { x: number; y: number }
  ) {
    const f1 = this.calculateFX(p1, p2);
    const f2 = this.calculateFX(p3, p4);
    const x = (f2.b - f1.b) / (f1.a - f2.a);
    const y = f1.a * x + f1.b;
    return { x, y };
  }

  calculateTiming({ p1, p2, velocity }: { p1: Plane, p2: { x: number; y: number }, velocity: number }) {
    console.log("P1:", p1, "P2:", p2, "Velocity:", velocity)
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
          const t1 = this.calculateTiming({ p1: planeI, p2: intersectionPoint, velocity: planeI.velocity });
          const t2 = this.calculateTiming({ p1: planeJ, p2: intersectionPoint, velocity: planeJ.velocity });

          console.log("Timings:", t1, t2)
          const epsilon = 0.001;
          if (Math.abs(t1 - t2) < epsilon && t1 <= minimumTime && t2 <= minimumTime) {
            collisionPlanes.push({ plane: [planeI, planeJ], distance: t1, message: `Colisao entre Avioes ${planeI.id} e ${planeJ.id} Tempo: ${t1.toFixed(2)} Hrs` });
          }
        }
      }
    }

    return collisionPlanes;
  }

  // Função para converter graus para radianos
  toRadians(angle: number): number {
    return angle * (Math.PI / 180);
  }

  // Função para calcular a posição de um avião em um tempo `t`
  calculatePositionAtTime(plane: Plane, t: number): { x: number; y: number } {
    const theta = this.toRadians(plane.direction);
    const vx = plane.velocity * Math.cos(theta);
    const vy = plane.velocity * Math.sin(theta);

    return {
      x: plane.x + vx * t,
      y: plane.y + vy * t,
    };
  }


  // Função para calcular os componentes de velocidade em x e y de um avião
  getVelocityComponents(plane: Plane): { vx: number; vy: number } {
    const theta = this.toRadians(plane.direction);
    return {
      vx: plane.velocity * Math.cos(theta),
      vy: plane.velocity * Math.sin(theta),
    };
  }

  calculateIntersectionTime(plane1: Plane, plane2: Plane): { tForX: number; tForY: number } | null {
    const { vx: vx1, vy: vy1 } = this.getVelocityComponents(plane1);
    const { vx: vx2, vy: vy2 } = this.getVelocityComponents(plane2);

    // Diferenças iniciais de posição
    const dx = plane2.x - plane1.x;
    const dy = plane2.y - plane1.y;

    // Velocidades relativas em x e y
    const relativeVx = vx1 - vx2;
    const relativeVy = vy1 - vy2;

    // Calcula os tempos para que x e y coincidam
    const tForX = dx / relativeVx;
    const tForY = dy / relativeVy;

    // Retorna os tempos para x e y
    return { tForX, tForY };
  }

  checkCollision({ planes }: { planes: Plane[] }): Tracking[] {
    const collisionPlanes: Tracking[] = [];

    const [plane1, plane2] = planes;


    const intersectionTime = this.calculateIntersectionTime(plane1, plane2);

    if (!intersectionTime) {

      collisionPlanes.push({ plane: [plane1, plane2], distance: 0, message: `Avioes ${plane1.id} e ${plane2.id} não colidem` });
      return collisionPlanes

    };

    const { tForX, tForY } = intersectionTime;
    const epsilon = 0.001;

    // Verifica se os tempos são próximos o suficiente e positivos
    if (Math.abs(tForX - tForY) < epsilon && tForX > 0) {
      collisionPlanes.push({ plane: [plane1, plane2], distance: tForX, message: `Colisao entre Avioes ${plane1.id} e ${plane2.id} Tempo: ${tForX.toFixed(2)} Hrs` });
      return collisionPlanes;
    }

    collisionPlanes.push({ plane: [plane1, plane2], distance: 0, message: `Avioes ${plane1.id} e ${plane2.id} não colidem` });
    return collisionPlanes; // Nenhuma colisão
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
