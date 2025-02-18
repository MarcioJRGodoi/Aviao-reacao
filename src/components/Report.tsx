import type React from 'react';
import { useEffect, useState } from 'react';
import type { Plane, Tracking } from '../interfaces';
import type { PositionPlanesService } from '../services/positionPlanesService';

interface RadarProps {
  positionPlane: PositionPlanesService;
}

const ReportComponent: React.FC<RadarProps> = ({ positionPlane }) => {
  const [trackingData, setTrackingData] = useState<Tracking[]>([]);
  const [_planes, setPlanes] = useState<Plane[]>(positionPlane.getPlanes());

  useEffect(() => {
    const handleChange = () => {
      console.log(positionPlane.getTracking());
      setTrackingData(positionPlane.getTracking());
      setPlanes([...positionPlane.getPlanes()]);
    };
    positionPlane.subscribeOnChange(handleChange);
    return () => {
      positionPlane.unsubscribeOnChange(handleChange);
    };
  }, [positionPlane]);

  const isArray = (planes: Plane | Plane[]): planes is Plane[] => {
    return Array.isArray(planes) && planes.length > 1;
  };

  return (
    <div className="border-solid border-white border-4 rounded-md h-full overflow-y-scroll bg-gray-900 z-50">
      <div className="sticky top-0 grid grid-cols-12 gap-4 bg-gray-900 z-50 text-white text-center font-bold">
        <div className="sticky top-0 col-span-12 grid grid-cols-12 gap-4 p-1 border-2 rounded-sm text-white bg-green-900">
          <div className="col-span-8">Mensagem</div>
          <div className="col-span-4">Aviões</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-2 text-white text-center font-bold">
        {trackingData.map((tracking, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div key={index} className="overflow-y-scroll col-span-12 grid grid-cols-12 p-1 cursor-pointer border-2 border-white text-white">
            {/* <div className="col-span-4">{tracking.distance ? tracking.distance.toFixed(2) : 0}</div> */}
            <div className="col-span-8">{tracking.message || ""}</div>
            {isArray(tracking.plane ?? []) ? (
              <div className="col-span-4">
                <div className="inline-flex">
                  {tracking.plane?.map((plane) => (
                    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
                    <svg
                      key={plane.id}
                      className="h-6 px-1 m-auto"
                      fill={plane.color}
                      viewBox="0 0 512.043 512.043"
                    >
                      <path d="M496.469,353.365l-197.781-197.76V67.904c0-13.845-3.072-27.797-9.131-40.811l-4.501-8.533
                               C279.744,7.104,268.629,0,256.021,0s-23.723,7.104-28.8,18.069l-4.971,9.493c-5.824,12.544-8.896,26.475-8.896,40.341v87.701
                               L15.637,353.323C5.568,363.392,0.021,376.768,0.021,391.019v25.003c0,3.904,2.133,7.488,5.547,9.344
                               c3.413,1.877,7.595,1.749,10.88-0.384l201.045-128.832c1.984,32.277,4.672,59.221,7.957,92.011l3.392,33.6l-74.688,49.344
                               c-3.008,2.005-4.8,5.333-4.8,8.917v21.333c0,3.221,1.472,6.293,3.989,8.32c2.539,2.048,5.845,2.816,8.981,2.112l93.696-20.843
                               l93.696,20.843c0.768,0.171,1.536,0.256,2.304,0.256c2.411,0,4.757-0.811,6.677-2.347c2.517-2.048,3.989-5.12,3.989-8.341v-21.333
                               c0-3.584-1.792-6.933-4.8-8.896l-74.688-49.28l3.392-33.707c3.285-32.747,5.973-59.669,7.957-91.947l201.045,128.789
                               c3.307,2.133,7.467,2.24,10.859,0.384c3.435-1.856,5.568-5.44,5.568-9.344v-25.003
                               C512.021,376.768,506.496,363.392,496.469,353.365z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ) : (
              <div className="col-span-4">
                {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                <svg className="h-6 m-auto" fill={(tracking.plane as unknown as Plane).color} viewBox="0 0 512.043 512.043">
                  <path d="M496.469,353.365l-197.781-197.76V67.904c0-13.845-3.072-27.797-9.131-40.811l-4.501-8.533
                           C279.744,7.104,268.629,0,256.021,0s-23.723,7.104-28.8,18.069l-4.971,9.493c-5.824,12.544-8.896,26.475-8.896,40.341v87.701
                           L15.637,353.323C5.568,363.392,0.021,376.768,0.021,391.019v25.003c0,3.904,2.133,7.488,5.547,9.344
                           c3.413,1.877,7.595,1.749,10.88-0.384l201.045-128.832c1.984,32.277,4.672,59.221,7.957,92.011l3.392,33.6l-74.688,49.344
                           c-3.008,2.005-4.8,5.333-4.8,8.917v21.333c0,3.221,1.472,6.293,3.989,8.32c2.539,2.048,5.845,2.816,8.981,2.112l93.696-20.843
                           l93.696,20.843c0.768,0.171,1.536,0.256,2.304,0.256c2.411,0,4.757-0.811,6.677-2.347c2.517-2.048,3.989-5.12,3.989-8.341v-21.333
                           c0-3.584-1.792-6.933-4.8-8.896l-74.688-49.28l3.392-33.707c3.285-32.747,5.973-59.669,7.957-91.947l201.045,128.789
                           c3.307,2.133,7.467,2.24,10.859,0.384c3.435-1.856,5.568-5.44,5.568-9.344v-25.003
                           C512.021,376.768,506.496,363.392,496.469,353.365z"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportComponent;
