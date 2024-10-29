import type React from 'react';
import { useState } from 'react';
import type { PositionPlanesService } from '../services/positionPlanesService';
import type { LogicService } from '../services/logicService';

interface TransformationFunctionProps {
  positionPlanes: PositionPlanesService;
  logic: LogicService;
}

const TransformationFunction: React.FC<TransformationFunctionProps> = ({ positionPlanes, logic }) => {
  const [xMove, setXMove] = useState<number | null>(null);
  const [yMove, setYMove] = useState<number | null>(null);
  const [xStagger, setXStagger] = useState<number | null>(null);
  const [yStagger, setYStagger] = useState<number | null>(null);
  const [xRotate, setXRotate] = useState<number | null>(null);
  const [yRotate, setYRotate] = useState<number | null>(null);
  const [angle, setAngle] = useState<number | null>(null);

  const translate = () => {
    if (xMove == null || yMove == null || positionPlanes.getSelectedPlanes().length === 0) return;
    const planes = logic.move(positionPlanes.getSelectedPlanes(), xMove, yMove);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
        planes.forEach((plane: any) => {
      positionPlanes.editPlane({ ...plane });
    });

    positionPlanes.clearSelectedPlanes();
    setXMove(null);
    setYMove(null);
  };

  const stagger = () => {
    if (xStagger == null || yStagger == null || positionPlanes.getSelectedPlanes().length === 0) return;
    const planes = logic.staggerDecimal(positionPlanes.getSelectedPlanes(), xStagger, yStagger);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
        planes.forEach((plane: any) => {
      positionPlanes.editPlane({ ...plane });
    });

    positionPlanes.clearSelectedPlanes();
    setXStagger(null);
    setYStagger(null);
  };

  const rotate = () => {
    if (xRotate == null || yRotate == null || angle == null || positionPlanes.getSelectedPlanes().length === 0) return;
    const planes = logic.rotate(positionPlanes.getSelectedPlanes(), angle, xRotate, yRotate);
    console.log(planes);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
        planes.forEach((plane: any) => {
      positionPlanes.editPlane({ ...plane });
    });

    positionPlanes.clearSelectedPlanes();
    setXRotate(null);
    setYRotate(null);
    setAngle(null);
  };

  return (
    <div className="p-2 grid grid-cols-2 gap-2 text-center">
      <div className="border-solid border-4 rounded-md col-span-1 p-1">
        <div className="p-2 grid grid-cols-2 gap-2 text-left">
          <div className="ml-4">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">X: </label>
            <input
              className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
              type="number"
              value={xMove ?? ''}
              onChange={(e) => setXMove(Number(e.target.value))}
            />
          </div>

          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">Y: </label>
            <input
              className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
              type="number"
              value={yMove ?? ''}
              onChange={(e) => setYMove(Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" onClick={translate}>
              Transladar
            </button>
          </div>
        </div>
      </div>

      <div className="border-solid border-4 rounded-md col-span-1 p-1">
        <div className="p-2 grid grid-cols-2 gap-2 text-left">
          <div className="ml-4">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">X: </label>
            <input
              className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
              type="number"
              value={xStagger ?? ''}
              onChange={(e) => setXStagger(Number(e.target.value))}
            />
          </div>

          <div>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">Y: </label>
            <input
              className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
              type="number"
              value={yStagger ?? ''}
              onChange={(e) => setYStagger(Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" onClick={stagger}>
              Escalonar
            </button>
          </div>
        </div>
      </div>

      <div className="border-solid border-4 rounded-md col-span-2 p-1">
        <div className="p-2 grid grid-cols-2 gap-4 text-left">
          <div className="relative">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">Ângulo: </label>
            <input
              className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
              type="number"
              value={angle ?? ''}
              onChange={(e) => setAngle(Number(e.target.value))}
            />
          </div>

          <div className="text-center">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="text-white">Centro de Rotação</label>
          </div>

          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" onClick={rotate}>
              Rotacionar
            </button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-white">X: </label>
                <input
                  className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
                  type="number"
                  value={xRotate ?? ''}
                  onChange={(e) => setXRotate(Number(e.target.value))}
                />
              </div>

              <div>
                {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-white">Y: </label>
                <input
                  className="w-8/12 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
                  type="number"
                  value={yRotate ?? ''}
                  onChange={(e) => setYRotate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformationFunction;
