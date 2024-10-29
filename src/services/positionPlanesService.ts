import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Plane, Tracking } from '../interfaces';

export class PositionPlanesService {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [x: string]: any;
  private planes: Plane[] = [];
  private selectedPlanes: Plane[] = [];
  private tracking: Tracking[] = [];
  private radarState = 'initial';
  public a = 0;

  public getPlanes(): Plane[] {
    return this.planes;
  }

  private onChangeCallbacks: (() => void)[] = [];

public subscribeOnChange(callback: () => void): void {
  this.onChangeCallbacks.push(callback);
}

public unsubscribeOnChange(callback: () => void): void {
  this.onChangeCallbacks = this.onChangeCallbacks.filter(cb => cb !== callback);
}

public notifyChange(): void {
  // biome-ignore lint/complexity/noForEach: <explanation>
  this.onChangeCallbacks.forEach((callback) => callback());
}

public addPlane(plane: Plane): void {
  if (!this.isValidPlane(plane)) return;
  plane.id = this.planes.length + 1;
  this.planes.push(plane);
  this.notifyChange(); // Notifica a mudança
  toast.success('Avião adicionado com sucesso!', { position: "top-right" });
}

  // public addPlane(plane: Plane): void {
  //   if (!this.isValidPlane(plane)) return;

  //   plane.id = this.planes.length + 1;
  //   console.log(this.planes);
  //   this.planes.push(plane);
  //   toast.success('Avião adicionado com sucesso!', { position: "top-right" });
  // }

  public editPlane(newPlane: Plane): void {
    const planeToEditIndex = this.planes.findIndex((plane) => plane.id === newPlane.id);
    if (planeToEditIndex !== -1) {
      this.planes[planeToEditIndex] = newPlane;
      toast.success('Avião editado com sucesso!', { position: "top-right" });
    } else {
      toast.error('Avião não encontrado!', { position: "top-right" });
    }
    this.notifyChange(); // Notifica a mudança
  }

  public selectPlane(plane: Plane): void {
    this.selectedPlanes.push(plane);
    this.notifyChange(); // Notifica a mudança
  }

  public deletePlane(planeToDelete: Plane): void {
    const planeToRemoveIndex = this.planes.findIndex((plane) => plane.id === planeToDelete.id);
    if (planeToRemoveIndex !== -1) {
      this.planes.splice(planeToRemoveIndex, 1);
      toast.success('Avião removido com sucesso!', { position: "top-right" });
    } else {
      toast.error('Avião não encontrado!', { position: "top-right" });
    }
    this.notifyChange(); // Notifica a mudança
  }

  public unselectPlane(planeToUnSelect: Plane): void {
    const planeToUnSelectIndex = this.selectedPlanes.findIndex((plane) => plane.id === planeToUnSelect.id);
    if (planeToUnSelectIndex !== -1) {
      this.selectedPlanes.splice(planeToUnSelectIndex, 1);
    }
    this.notifyChange(); // Notifica a mudança
  }

  public getSelectedPlanes(): Plane[] {
    return this.selectedPlanes;
  }

  public clearSelectedPlanes(): void {
    this.selectedPlanes = [];
  }

  public checkIsSelected(planeToCheck: Plane): boolean {
    return this.selectedPlanes.some((plane) => planeToCheck.id === plane.id);
  }

  private isValidPlane(plane: Plane): boolean {
    if (plane.x > 100 || plane.x < -100|| plane.y > 100|| plane.y < -100) {
      toast.error('Avião posicionado fora do alcance', { position: "top-right" });
      return false;
    }
    return true;
  }

  public getRadarState(): string {
    return this.radarState;
  }

  public setRadarState(state: string): void {
    this.radarState = state;
  }

  public addTracking({tracking}: {tracking: Tracking[]}): void {
    this.tracking.push(...tracking); // Para acumular rastreamentos
    this.notifyChange(); // Notifica a mudança
    this.a = this.a + 1;

  }

  public getTracking(): Tracking[] {
    return this.tracking;
  }
}
