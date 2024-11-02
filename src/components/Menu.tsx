import type React from 'react';
import { useState, useRef } from 'react';
import DataInput from './DataInput';
import TransformationFunction from './TransformationFunction';
import TrackingFunction from './TrankingFunction';
import Radar from './Radar';
import DataGrid from './DataGrid';
import Report from './Report';
import { PositionPlanesService } from '../services/positionPlanesService';
import { LogicService } from '../services/logicService';
import './CSS/cssMenu.css';

const Menu: React.FC = () => {
  const [_state, setState] = useState<'initial' | 'final'>('initial');

  // Usando useRef para instanciar uma única vez
  const positionPlanesRef = useRef(new PositionPlanesService());
  const logicServiceRef = useRef(new LogicService());

  const changeState = () => {
    setState((prevState) => (prevState === 'initial' ? 'final' : 'initial'));
  };

  return (
    <div className="bg-gray-900 h-screen">
      <div className="h-full p-4 ml-6 mr-6 grid grid-rows-6 grid-flow-col gap-4">
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md">Entrada de Dados</h1>
          <DataInput radar={positionPlanesRef.current} />
        </div>
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md mt-6">Funções de Transformação</h1>
          <TransformationFunction positionPlanes={positionPlanesRef.current} logic={logicServiceRef.current} />
        </div>
        <div className="row-span-1 col-span-12">
          <h1 className="text-white font-bold text-center text-md mt-8">Funções de Rastreamento</h1>
          <TrackingFunction logic={logicServiceRef.current} positionPlanes={positionPlanesRef.current} />
        </div>
        <div className="row-span-4 col-span-6">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div className="button" onClick={changeState}>
            Limpar Dados
          </div>
          <Radar positionPlane={positionPlanesRef.current} logicService={logicServiceRef.current} />
        </div>
        <div className="row-span-2 col-span-6">
          <h1 className="text-white font-bold text-center text-md">DataGrid</h1>
          <DataGrid positionPlane={positionPlanesRef.current} />
        </div>
        <div className="row-span-3 col-span-6">
          <h1 className="text-white font-bold text-center text-md mt-8">Relatório</h1>
          <Report positionPlane={positionPlanesRef.current} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
