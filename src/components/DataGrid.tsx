import type React from 'react';
import { useEffect, useState } from 'react';
import type { Plane } from '../interfaces';
import type { PositionPlanesService } from '../services/positionPlanesService';
import { FaTrash } from "react-icons/fa";
import "./DataGrid.css"

interface DataGridProps {
  positionPlane: PositionPlanesService;
}

const DataGrid: React.FC<DataGridProps> = ({ positionPlane }) => {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [_selectedPlanes, _setSelectedPlanes] = useState<Plane[]>([]);

  useEffect(() => {
    const handleChange = () => {
      setPlanes([...positionPlane.getPlanes()]);
    };

    positionPlane.subscribeOnChange(handleChange);

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

  const selectPlane = (plane: Plane) => {
    if (positionPlane.checkIsSelected(plane)) {
      positionPlane.unselectPlane(plane);
    } else {
      positionPlane.selectPlane(plane);
    }
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-lg h-full overflow-y-auto">
      <div className="sticky top-0 grid grid-cols-12 gap-2 bg-indigo-600 text-white text-center font-semibold py-2">
        <div className="col-span-1">#</div>
        <div className="col-span-1">X</div>
        <div className="col-span-1">Y</div>
        <div className="col-span-1">Raio</div>
        <div className="col-span-2">Ângulo</div>
        <div className="col-span-3">Velocidade</div>
        <div className="col-span-2">Direção</div>
        <div className="col-span-1">Ação</div>
      </div>

      <div className="grid gap-1 text-gray-800 text-sm">
        {planes.map((plane) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
            key={plane.id}
            onClick={() => selectPlane(plane)}
            className={`grid grid-cols-12 gap-2 py-2 px-3 cursor-pointer transition duration-200 ${positionPlane.checkIsSelected(plane) ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
          >
            <div className="col-span-1 flex justify-center">
              <svg
                fill={plane.color}
                viewBox="0 0 512.043 512.043"
                width="20"
                height="20"
              >
                <title>Plane Icon</title>
                <path d="M496.469,353.365l-197.781-197.76V67.904c0-13.845-3.072-27.797-9.131-40.811l-4.501-8.533C279.744,7.104,268.629,0,256.021,0s-23.723,7.104-28.8,18.069l-4.971,9.493c-5.824,12.544-8.896,26.475-8.896,40.341v87.701L15.637,353.323C5.568,363.392,0.021,376.768,0.021,391.019v25.003c0,3.904,2.133,7.488,5.547,9.344c3.413,1.877,7.595,1.749,10.88-0.384l201.045-128.832c1.984,32.277,4.672,59.221,7.957,92.011l3.392,33.6l-74.688,49.344c-3.008,2.005-4.8,5.333-4.8,8.917v21.333c0,3.221,1.472,6.293,3.989,8.32c2.539,2.048,5.845,2.816,8.981,2.112l93.696-20.843l93.696,20.843c0.768,0.171,1.536,0.256,2.304,0.256c2.411,0,4.757-0.811,6.677-2.347c2.517-2.048,3.989-5.12,3.989-8.341v-21.333c0-3.584-1.792-6.933-4.8-8.896l-74.688-49.28l3.392-33.707c3.285-32.747,5.973-59.669,7.957-91.947l201.045,128.789c3.307,2.133,7.467,2.24,10.859,0.384c3.435-1.856,5.568-5.44,5.568-9.344v-25.003C512.021,376.768,506.496,363.392,496.469,353.365z"/>
              </svg>
            </div>
            <div className="col-span-1 text-center">{plane.x.toFixed(2)}</div>
            <div className="col-span-1 text-center">{plane.y.toFixed(2)}</div>
            <div className="col-span-1 text-center">{plane.radius.toFixed(2)}</div>
            <div className="col-span-2 text-center">{plane.angle.toFixed(2)}</div>
            <div className="col-span-3 text-center">{plane.velocity.toFixed(2)}</div>
            <div className="col-span-2 text-center">{plane.direction.toFixed(2)}</div>
            <div className="col-span-1 flex justify-center items-center">
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation();
                  positionPlane.deletePlane(plane);
                  fetchPlanes();
                }}
                className="text-red-500 hover:text-red-700 transition duration-150"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
