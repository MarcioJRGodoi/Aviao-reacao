import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import type { PositionPlanesService } from "../services/positionPlanesService";
import type { Plane } from "../interfaces";

const RadarContainer = styled.div<{ isInitial: boolean }>`
  border: 8px solid gray;
  border-radius: ${(props) => (props.isInitial ? "605px" : "0px")};
  background-color: #008500;
  width: 605px;
  height: 605px;
  position: relative;
  z-index: 999999999;
  transition: border-radius 1s;
`;

const GridCell = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid black;
  opacity: 0.25;
`;

const Line = styled.div<{ vertical?: boolean }>`
  position: absolute;
  background-color: black;
  ${(props) =>
    props.vertical
      ? "width: 2px; height: 600px; left: 299px;"
      : "height: 2px; width: 600px; top: 299px;"}
`;

const RadarCenter = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #b91c1c;
  position: absolute;
  top: 295px;
  left: 295px;
`;

interface PlaneProps {
  x: number;
  y: number;
  direction: number;
  color: string;
}

interface RadarProps {
  positionPlane: PositionPlanesService;
}

const Radar: React.FC<RadarProps> = ({ positionPlane }) => {
  const [isInitial, setIsInitial] = useState(true);
  const [planes, setPlanes] = useState<Plane[]>(positionPlane.getPlanes());

  useEffect(() => {
    const handleChange = () => {
      setPlanes([...positionPlane.getPlanes()]);
    };
    positionPlane.subscribeOnChange(handleChange);

    return () => {
      // Clean up the subscription
      positionPlane.subscribeOnChange(handleChange);
    };
  }, [positionPlane]);


  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const selectPlane = (plane: any) => {
    if (positionPlane.checkIsSelected(plane)) {
      positionPlane.unselectPlane(plane);
    } else {
      positionPlane.selectPlane(plane);
    }
  };

  const fixX = (x: number) => x * 60 + 299 - 15;
  const fixY = (y: number) => y * -60 + 299 - 15;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log("useEffect");
  }, [positionPlane]);

  return (
    <RadarContainer isInitial={isInitial}>
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

        <Line vertical />
        <Line />

        <RadarCenter />

        {positionPlane.getPlanes().map((plane, index) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            onClick={() => selectPlane(plane)}
            style={{
              position: "absolute",
              top: `${fixY(plane.y)}px`,
              left: `${fixX(plane.x)}px`,
              transform: `rotate(-${plane.direction}deg)`,
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
      </div>
    </RadarContainer>
  );
};

export default Radar;
