// src/AppRouter.tsx
import type React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import DataInput from './components/DataInput';
import TransformationFunction from './components/TransformationFunction';
import TrackingFunction from './components/TrankingFunction';
import Radar from './components/Radar';
import DataGrid from './components/DataGrid';
import Report from './components/Report';
import { PositionPlanesService } from './services/positionPlanesService';
import { LogicService } from './services/logicService';

const positionPlanesService = new PositionPlanesService();


const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/data-input" element={<DataInput />} />
      <Route path="/transformation" element={<TransformationFunction positionPlanes={new PositionPlanesService} logic={new LogicService} />} />
      <Route path="/tracking" element={<TrackingFunction />} />
      <Route path="/radar" element={<Radar />} />
      <Route path="/data-grid" element={<DataGrid />} />
      <Route path="/report" element={<Report PositionPlanes={positionPlanesService} />} />
      </Routes>
  </Router>
);

export default AppRouter;
