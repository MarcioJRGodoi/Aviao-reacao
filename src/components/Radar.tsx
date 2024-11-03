import type React from "react";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import type { PositionPlanesService } from "../services/positionPlanesService";
import type { Plane } from "../interfaces";

// Efeito de expansão para o radar
const radarSweep = keyframes`
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 600px;
    height: 600px;
    opacity: 0;
  }
`;
const RadarSweepEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(0, 255, 0, 0.2); /* Cor verde semi-transparente */
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${radarSweep} 2s linear infinite; /* Animação contínua */
`;
const RadarContainer = styled.div<{ isInitial: boolean }>`
  border: 8px solid gray;
  border-radius: 50%; /* Isso garante o formato circular */
  background-color: #black;
  width: 605px;
  height: 605px;
  position: relative;
  z-index: 999999999;
  overflow: hidden; /* Propriedade para manter a grade dentro do círculo */
  transition: border-radius 1s;
`;
// Define os estilos para os círculos internos sem preenchimento
const InnerCircleSmall = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px; /* Tamanho do círculo menor */
  height: 200px;
  border: 2px solid rgba(0, 255, 0, 0.5); /* Cor verde com transparência para o contorno */
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const InnerCircleLarge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px; /* Tamanho do círculo maior */
  height: 400px;
  border: 3px solid rgba(0, 255, 0, 0.3); /* Cor verde mais clara e transparente para o contorno */
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const GridCell = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid  #008500;
  opacity: 0.25;
`;

const LineV = styled.div<{ vertical?: boolean }>`
  position: absolute;
background-color: rgba(82, 164, 72, 0.2);
   height: 2px; width: 600px; top: 299px; 
  
`;
const LineH = styled.div<{ vertical?: boolean }>`
  position: absolute;
background-color: rgba(82, 164, 72, 0.2);
  height: 600px; width: 600px; top: 0px; 
  width: 2px; height: 600px; left: 299px;"
`;

const RadarCenter = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
 background-color: #52a448;
  position: absolute;
  top: 295px;
  left: 295px;
`;


const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const PalitoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
  animation: ${spin} 5s linear infinite;
`;

const Palito = styled.div`
  width: 8px; /* Largura do palito */
  height: 300px; /* Aumentamos a altura do palito */
  background-color: #52a448;
  border-radius: 4px; /* Suavizamos as bordas */
  position: absolute;
  top: -300px; /* Move o palito para cima */
  left: -4px; /* Centraliza horizontalmente o palito */
`;

interface RadarProps {
  positionPlane: PositionPlanesService;
}

const Radar: React.FC<RadarProps> = ({ positionPlane }) => {
  const [isInitial, _setIsInitial] = useState(true);
  const [_planes, setPlanes] = useState<Plane[]>(positionPlane.getPlanes());
  const [collisions, setCollisions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {

    const handleChange = () => {
      setPlanes([...positionPlane.getPlanes()]);
    };
    positionPlane.subscribeOnChange(handleChange);

    return () => {
      // Clean up the subscription
      positionPlane.unsubscribeOnChange(handleChange);
    };
  }, [positionPlane]);

  useEffect(() => {
    // Atualização em intervalos regulares
    const interval = setInterval(() => {
     const colision =  positionPlane.updatePlanePositions();
      if(colision.length > 0){
        setCollisions(colision);
      }

      setPlanes([...positionPlane.getPlanes()]);
    }, 1000); // Atualiza a cada 100ms

    return () => clearInterval(interval);
  }, [positionPlane]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

  //   //um atras do outro
  //   // positionPlane.addPlane({ x: 0, y: 50, direction: 90, color: "red",angle: 0, id: 0, radius: 0, velocity: 5 });
  //   // positionPlane.addPlane({ x: 0, y: 20, direction: 90, color: "blue",angle: 0, id: 1, radius: 0, velocity: 100 });

  //   // um do lado do outro
  //   // positionPlane.addPlane({ x: 10, y: 20, direction: 90, color: "red",angle: 0, id: 0, radius: 0, velocity: 10 });
  //   // positionPlane.addPlane({ x: 30, y: 20, direction: 90, color: "blue",angle: 0, id: 1, radius: 0, velocity: 10 });

  //   // colisao com posicoes bem diferentes
    positionPlane.addPlane({ x: 50, y: -8, direction: 90, color: "red",angle: 0, id: 0, radius: 0, velocity: 50 });
    positionPlane.addPlane({ x: -5, y: 50, direction: 0, color: "blue",angle: 0, id: 1, radius: 0, velocity: 50 });

        // colisao com posicoes bem diferentes +
        // positionPlane.addPlane({ x: 100, y: 0, direction: 90, color: "red", angle: 0, id: 0, radius: 0, velocity: 50 });  
        // positionPlane.addPlane({ x: 0, y: 0, direction: 45, color: "blue", angle: 0, id: 1, radius: 0, velocity: 50 });  
  },[])


  const selectPlane = (plane: Plane) => {
    if (positionPlane.checkIsSelected(plane)) {
      positionPlane.unselectPlane(plane);
    } else {
      positionPlane.selectPlane(plane);
    }
  };
  const fixX = (x: number) => (x * 0.9) + 299 - 15; // Reduza de 60 para 30, por exemplo
  const fixY = (y: number) => (y * -0.9) + 299 - 15;

  return (
    <RadarContainer isInitial={isInitial}>
         <RadarSweepEffect />
         <InnerCircleLarge /> {/* Círculo maior */}
      <InnerCircleSmall /> {/* Círculo menor */}
      
      <div style={{ width: "600px", height: "600px", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 60px)",
            width: "600px",
          }}
        >
          {Array.from({ length: 100 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <GridCell key={index} />
          ))}
        </div>
        <PalitoContainer>
          <Palito />
        </PalitoContainer>
        <LineV  />
        <LineH  />

        <RadarCenter />

        {positionPlane.getPlanes().map((plane) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={plane.id}
            onClick={() => selectPlane(plane)}
            style={{
              position: "absolute",
              top: `${fixY(plane.y)}px`,
              left: `${fixX(plane.x)}px`,
              transform: `rotate(${90 - plane.direction}deg)`,
              cursor: "pointer",
            }}
          >
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
              fill={plane.color}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.043 512.043"
              width="30px"
              height="30px"
            >
              <path d="M496.469,353.365l-197.781-197.76V67.904c0-13.845-3.072-27.797-9.131-40.811l-4.501-8.533C279.744,7.104,268.629,0,256.021,0s-23.723,7.104-28.8,18.069l-4.971,9.493c-5.824,12.544-8.896,26.475-8.896,40.341v87.701L15.637,353.323C5.568,363.392,0.021,376.768,0.021,391.019v25.003c0,3.904,2.133,7.488,5.547,9.344c3.413,1.877,7.595,1.749,10.88-0.384l201.045-128.832c1.984,32.277,4.672,59.221,7.957,92.011l3.392,33.6l-74.688,49.344c-3.008,2.005-4.8,5.333-4.8,8.917v21.333c0,3.221,1.472,6.293,3.989,8.32c2.539,2.048,5.845,2.816,8.981,2.112l93.696-20.843l93.696,20.843c0.768,0.171,1.536,0.256,2.304,0.256c2.411,0,4.757-0.811,6.677-2.347c2.517-2.048,3.989-5.12,3.989-8.341v-21.333c0-3.584-1.792-6.933-4.8-8.896l-74.688-49.28l3.392-33.707c3.285-32.747,5.973-59.669,7.957-91.947l201.045,128.789c3.307,2.133,7.467,2.24,10.859,0.384c3.435-1.856,5.568-5.44,5.568-9.344v-25.003C512.021,376.768,506.496,363.392,496.469,353.365z" />
            </svg>
          </div>
        ))}
{collisions.map((collision, index) => (
  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
<svg
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    key={index}
    style={{
      position: "absolute",
      top: `${fixY(collision.y)}px`,
      left: `${fixX(collision.x)}px`,
      pointerEvents: "none" // Para que o X não interfira nos cliques nas aeronaves
    }}
    width="30"
    height="30"
  >
    <line
      x1="5" y1="5" x2="25" y2="25"
      stroke="red"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <line
      x1="25" y1="5" x2="5" y2="25"
      stroke="red"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
))}
      </div>
    </RadarContainer>
  );
};

export default Radar;
