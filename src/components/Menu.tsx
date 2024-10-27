// Menu.tsx
import type React from 'react';
import { useState } from 'react';
import DataInput from './DataInput';
import TransformationFunction from './TransformationFunction';
import TrackingFunction from './TrankingFunction';
import Radar from './Radar';
import DataGrid from './DataGrid';
import Report from './Report';
import { PositionPlanesService } from '../services/positionPlanesService';
import { LogicService } from '../services/logicService';

const Menu: React.FC = () => {
  const [state, setState] = useState<'initial' | 'final'>('initial');

  const changeState = () => {
    setState((prevState) => (prevState === 'initial' ? 'final' : 'initial'));
  };


  return (
    <div className="bg-gray-900 h-screen">
      <div className="h-full p-4 ml-6 mr-6 grid grid-rows-6 grid-flow-col gap-4">
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md">Entrada de Dados</h1>
          <DataInput />
        </div>
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md mt-6">Funções de Transformação</h1>
          <TransformationFunction positionPlanes={new PositionPlanesService} logic={new LogicService} />
        </div>
        <div className="row-span-1 col-span-12">
          <h1 className="text-white font-bold text-center text-md mt-8">Funções de Rastreamento</h1>
          <TrackingFunction />
        </div>
        <div className="row-span-4 col-span-6">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className={`w-20 h-4 bg-gray-400 mx-auto rounded-lg cursor-pointer ${state === 'final' ? 'animate-pressButton' : ''}`}
            onClick={changeState}
          />
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          <div className="w-10 h-2 bg-gray-400 mx-auto"></div>
          <Radar />
        </div>
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md">DataGrid</h1>
          <DataGrid />
        </div>
        <div className="row-span-3 col-span-6">
          <h1 className="text-white font-bold text-center text-md mt-8">Relatório</h1>
          <Report PositionPlanes={new PositionPlanesService()} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
