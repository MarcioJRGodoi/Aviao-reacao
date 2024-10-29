import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Se você estiver usando alguma biblioteca de notificações similar
import type { PositionPlanesService } from '../services/positionPlanesService';

// Função de serviço simulada para conversão e adição ao radar
const polarToCartesian = (radius: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return [radius * Math.cos(rad), radius * Math.sin(rad)];
};

interface DataInputProps {
  radar: PositionPlanesService;
}

const DataInput: React.FC<DataInputProps> = ({ radar }) => {
  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [angle, setAngle] = useState<number | null>(null);
  const [velocity, setVelocity] = useState<number | null>(null);
  const [direction, setDirection] = useState<number | null>(null);

  const toastr = toast; // Inicialize sua biblioteca de notificações aqui

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const insertAirplane = () => {
    if (x === null || y === null) {
      toastr.error('Por favor, preencha todos os campos necessários.');
      return;
    }
    const plane = {
      id: Date.now(),
      x: x ?? 0,
      y: y ?? 0,
      radius: radius ?? 0,
      angle: angle ?? 0,
      velocity: velocity ?? 0,
      direction: direction? direction % 360 : 0,  // Ajuste para manter a direção entre 0 e 360
      color: getRandomColor(),
    };
  
    radar.addPlane(plane); // Supondo que radar seja o serviço equivalente
  
    clearFields();
  };

  const convertToCartesian = () => {
    if (radius != null && angle != null) {
      const [newX, newY] = polarToCartesian(radius, angle);
      setX(newX);
      setY(newY);
    }
  };

  const clearFields = () => {
    setX(null);
    setY(null);
    setRadius(null);
    setAngle(null);
    setVelocity(null);
    setDirection(null);
  };

  return (
    <div className="border-solid border-white border-4 rounded-md p-2">
      <div className="p-1 my-4 grid grid-cols-2 gap-3 text-left">
        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">X: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={x ?? ""}
            onChange={(e) => setX(Number(e.target.value))}
            required
          />
        </div>

        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">Y: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={y ?? ""}
            onChange={(e) => setY(Number(e.target.value))}
            required
          />
        </div>

        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">Raio: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={radius ?? ""}
            onChange={(e) => setRadius(Number(e.target.value))}
            onBlur={convertToCartesian}
          />
        </div>

        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">Ângulo: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={angle ?? ""}
            onChange={(e) => setAngle(Number(e.target.value))}
            onBlur={convertToCartesian}
          />
        </div>

        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">Velocidade: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={velocity ?? ""}
            onChange={(e) => setVelocity(Number(e.target.value))}
          />
        </div>

        <div className="relative">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="text-white">Direção: </label>
          <input
            className="absolute right-0 w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
            type="number"
            value={direction ?? ""}
            onChange={(e) => setDirection(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
          onClick={insertAirplane}
        >
          Inserir
        </button>
      </div>
    </div>
  );
};

export default DataInput;
