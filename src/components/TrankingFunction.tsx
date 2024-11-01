import type React from "react";
import { useState } from "react";
import type { LogicService } from "../services/logicService";
import type { PositionPlanesService } from "../services/positionPlanesService";

interface TransformationFunctionProps {
	positionPlanes: PositionPlanesService;
	logic: LogicService;
}

const TrackingFunctionComponent: React.FC<TransformationFunctionProps> = ({
	logic,
	positionPlanes,
}) => {
	const [distanAirport, setDistanAirport] = useState<number | null>(null);
	const [distanNearly, setDistanNearly] = useState<number | null>(null);
	const [timeToColision, setTimeToColision] = useState<number | null>(null);

	const airport = { x: 0, y: 0 };

	const handleAirpotDistance = () => {
		if (distanAirport === null) return;

		const distances = logic.planesClosestToAirport(
			airport,
			positionPlanes.getPlanes(),
			distanAirport,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) as any;

		console.log(distances);
		positionPlanes.addTracking({ tracking: distances });
		setDistanAirport(null);
	};

	const handleNearlyPlanes = () => {
		if (distanNearly === null) return;

		const distances = logic.planesClosestToPlanes(
			positionPlanes.getPlanes(),
			distanNearly,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		) as any;

		positionPlanes.addTracking({ tracking: distances });
		setDistanNearly(null);
	};

	const handleColisionTime = () => {
		const selectedPlanes = positionPlanes.getSelectedPlanes();

		if (selectedPlanes.length < 2 || !timeToColision) {
			alert(
				"É preciso selecionar pelo menos 2 aviões e preencher o tempo mínimo!!",
			);
			return;
		}

		console.log("dsadas ", logic.checkCollision({ planes: selectedPlanes }));

		const distances = logic.checkCollision({ planes: selectedPlanes })

		positionPlanes.addTracking({ tracking: distances });
		setTimeToColision(null);
		positionPlanes.clearSelectedPlanes();
	};

	return (
		<div className="grid grid-cols-12 gap-2 h-full text-center">
			<div className="col-span-4 border-4 p-4 border-white">
				<div className="grid grid-rows-2 text-center mt-4">
					<div>

						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="text-white">Distância Mín: </label>
						<input
							className="w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
							type="number"
							value={distanAirport ?? ""}
							onChange={(e) => setDistanAirport(Number(e.target.value))}
						/>
					</div>

					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
						className="w-full bg-green-800 hover:bg-blue-700 text-white font-bold rounded"
						onClick={handleAirpotDistance}
					>
						Aviões próximos ao Aeroporto
					</button>
				</div>
			</div>

			<div className="col-span-4 border-4 p-4 border-white">
				<div className="grid grid-rows-2 text-center mt-4">
					<div>

						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-white">Distância Mín: </label>
						<input
							className="w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
							type="number"
							value={distanNearly ?? ""}
							onChange={(e) => setDistanNearly(Number(e.target.value))}
						/>
					</div>

					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
						className="w-full bg-green-800 hover:bg-blue-700 text-white font-bold rounded"
						onClick={handleNearlyPlanes}
					>
						Aviões Próximos
					</button>
				</div>
			</div>

			<div className="col-span-4 border-solid border-green border-2 p-4 border-white">
				<div className="grid grid-rows-2 text-center mt-4">
					<div>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
						<label className="text-white">Tempo Mín.: </label>
						<input
							className="w-16 shadow appearance-none border rounded text-gray-700 focus:outline-none focus:shadow-outline"
							type="number"
							value={timeToColision ?? ""}
							onChange={(e) => setTimeToColision(Number(e.target.value))}
						/>
					</div>
					{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
					<button
						className="w-full bg-green-800 hover:bg-blue-700 text-white font-bold rounded"
						onClick={handleColisionTime}
					>
						Em rota de colisão
					</button>
				</div>
			</div>
		</div>
	);
};

export default TrackingFunctionComponent;
