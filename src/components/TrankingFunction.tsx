import type React from "react";
import { useState } from "react";
import { PositionPlanesService } from "../services/positionPlanesService";
import { LogicService } from "../services/logicService";

const positionPlanesService = new PositionPlanesService();
const logicService = new LogicService();

const TrackingFunctionComponent: React.FC = () => {
	const [distanAirport, setDistanAirport] = useState<number | null>(null);
	const [distanNearly, setDistanNearly] = useState<number | null>(null);
	const [timeToColision, setTimeToColision] = useState<number | null>(null);

	const airport = { x: 0, y: 0 };

	const handleAirpotDistance = () => {
		if (distanAirport === null) return;

		const distances = logicService.planesClosestToAirport(
			airport,
			positionPlanesService.getPlanes(),
			distanAirport,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) as any;

		positionPlanesService.addTracking(distances);
		setDistanAirport(null);
	};

	const handleNearlyPlanes = () => {
		if (distanNearly === null) return;

		const distances = logicService.planesClosestToPlanes(
			positionPlanesService.getPlanes(),
			distanNearly,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) as any;

		positionPlanesService.addTracking(distances);
		setDistanNearly(null);
	};

	const handleColisionTime = () => {
		const selectedPlanes = positionPlanesService.getSelectedPlanes();

		if (selectedPlanes.length < 2 || !timeToColision) {
			alert("É preciso selecionar pelo menos 2 aviões e preencher o tempo mínimo!!");
			return;
		}

		const distances = logicService.planesInCollisionRoute({
			minimumTime: timeToColision,
			planes: selectedPlanes,
		});

		positionPlanesService.addTracking({ tracking: distances });
		setTimeToColision(null);
		positionPlanesService.clearSelectedPlanes();
	};

	return (
		<div className="flex flex-col md:flex-row justify-center items-start p-4 bg-gray-800 rounded-lg shadow-lg h-full">
			{/* Seção para Aviões próximos ao Aeroporto */}
			<div className="flex flex-col items-center bg-gray-700 border border-gray-600 rounded-lg p-5 m-2 w-full md:w-1/3">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-white mb-2">Distância Mín:</label>
				<input
					className="w-full max-w-xs p-2 mb-4 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
					type="number"
					value={distanAirport ?? ""}
					onChange={(e) => setDistanAirport(Number(e.target.value))}
				/>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
					className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 transition-colors duration-300"
					onClick={handleAirpotDistance}
				>
					Aviões próximos ao Aeroporto
				</button>
			</div>

			{/* Seção para Aviões Próximos */}
			<div className="flex flex-col items-center bg-gray-700 border border-gray-600 rounded-lg p-4 m-2 w-full md:w-1/3">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-white mb-2">Distância Mín:</label>
				<input
					className="w-full max-w-xs p-2 mb-4 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
					type="number"
					value={distanNearly ?? ""}
					onChange={(e) => setDistanNearly(Number(e.target.value))}
				/>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
					className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 transition-colors duration-300"
					onClick={handleNearlyPlanes}
				>
					Aviões Próximos
				</button>
			</div>

			{/* Seção para Em Rota de Colisão */}
			<div className="flex flex-col items-center bg-gray-700 border border-gray-600 rounded-lg p-4 m-2 w-full md:w-1/3">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-white mb-2">Tempo Mín:</label>
				<input
					className="w-full max-w-xs p-2 mb-4 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
					type="number"
					value={timeToColision ?? ""}
					onChange={(e) => setTimeToColision(Number(e.target.value))}
				/>
				{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
					className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-2 transition-colors duration-300"
					onClick={handleColisionTime}
				>
					Em rota de colisão
				</button>
			</div>
		</div>
	);
};

export default TrackingFunctionComponent;
