import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Plane } from '../interfaces';
import type { PositionPlanesService } from '../services/positionPlanesService';


interface DataGridProps {
  positionPlane: PositionPlanesService;
}

const DataGrid: React.FC<DataGridProps> = ({positionPlane}) => {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [_selectedPlanes, _setSelectedPlanes] = useState<Plane[]>([]);

  useEffect(() => {
    const handleChange = () => {
      setPlanes([...positionPlane.getPlanes()]);
    };
  
    // Assina as mudanças no PositionPlanesService
    positionPlane.subscribeOnChange(handleChange);
  
    // Limpa a assinatura ao desmontar o componente
    return () => {
      positionPlane.subscribeOnChange(handleChange);
    };
  }, [positionPlane]);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = () => {
    const planesData = positionPlane.getPlanes();
    setPlanes(planesData);
  };

  const checkPlane = (plane: Plane) => {
    return positionPlane.checkIsSelected(plane);
  };

  const selectPlane = (plane: Plane) => {
    positionPlane.selectPlane(plane);
    fetchPlanes();
  };

  const unselectPlane = (plane: Plane) => {
    positionPlane.unselectPlane(plane);
    fetchPlanes();
  };

  return (
    <div className="border-solid border-white border-4 rounded-md h-full overflow-y-scroll bg-gray-900 z-50">
      <div className="sticky top-0 grid grid-cols-12 gap-4 bg-gray-900 z-50 p-2 text-white text-center font-bold overflow-y-scroll">
        <div className="col-span-12 grid grid-cols-12 gap-4 p-1 border-2 rounded-sm text-white bg-blue-600 overflow-y-scroll">
          <div className="col-span-1">#</div>
          <div className="col-span-1">X</div>
          <div className="col-span-1">Y</div>
          <div className="col-span-1">Raio</div>
          <div className="col-span-2">Ângulo</div>
          <div className="col-span-3">Velocidade</div>
          <div className="col-span-2">Direção</div>
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div className="col-span-1"></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-2 text-white text-center font-bold overflow-y-scroll">
        {planes.map((plane) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
            key={plane.id}
            onClick={() => (checkPlane(plane) ? unselectPlane(plane) : selectPlane(plane))}
            className={`col-span-12 grid grid-cols-12 gap-4 p-1 cursor-pointer border-2 border-white ${
              checkPlane(plane) ? 'bg-white bg-opacity-50' : 'hover:bg-white hover:bg-opacity-25'
            }`}
          >
            <div className="col-span-1">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg
                fill={plane.color}
                viewBox="0 0 512.043 512.043"
                className="mx-auto"
              >
                {/* SVG path content */}
              </svg>
            </div>
            <div className="col-span-1">{plane.x.toFixed(2)}</div>
            <div className="col-span-1">{plane.y.toFixed(2)}</div>
            <div className="col-span-1">{plane.radius.toFixed(2)}</div>
            <div className="col-span-2">{plane.angle.toFixed(2)}</div>
            <div className="col-span-3">{plane.velocity.toFixed(2)}</div>
            <div className="col-span-2">{plane.direction.toFixed(2)}</div>
            <div className="col-span-1">
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  positionPlane.deletePlane(plane);
                  fetchPlanes();
                }}
                className="mx-auto"
                src="/path/to/trash.png"
                alt="Delete"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
