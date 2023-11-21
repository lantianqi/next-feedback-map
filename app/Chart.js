import React, { useEffect, useRef, useState } from 'react';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

const Chart = ({ filter, chartId, height, width }) => {
  const sdk = new ChartsEmbedSDK({ baseUrl: "https://charts.mongodb.com/charts-lantianqi-feedback-map-fjizi" });
  const chartDiv = useRef(null);
  const [rendered, setRendered] = useState(false);
  const [chart] = useState(sdk.createChart({ chartId: "6555f18e-bbd7-409f-8e63-9106dea6ac3b", theme: "light", autoRefresh: true, maxDataAge: 1 }));

  useEffect(() => {
    chart.render(chartDiv.current).then(() => setRendered(true)).catch(err => console.log("Error during Charts rendering.", err));
  }, [chart]);

  useEffect(() => {
    if (rendered) {
      chart.setFilter(filter).catch(err => console.log("Error while filtering.", err));
    }
  }, [chart, filter, rendered]);

  const refreshChart = () => {
    if('caches' in window){
      caches.keys().then((names) => {
              // Delete all the cache files
              names.forEach(name => {
                  caches.delete(name);
              })
          });
  
          // Makes sure the page reloads. Changes are only visible after you refresh.
          window.location.reload(true);
    }
    chart.refresh();
  }

  return (
    <div className="w-full h-full">
      {/* <button id='refresh' onClick={() => chart.refresh()}> refresh </button>
      <button id='refresh' onClick={() => refreshChart()}> refresh </button> */}
      <div className="chart" ref={chartDiv} />
      {/* <iframe style={{background: "#F1F5F4", border: "none", borderRadius: 2, boxShadow: "0 2px 10px 0", rgba: (70, 76, 79, .2), width: 100 +"vw", height: 100+"vh"}}  src="https://charts.mongodb.com/charts-lantianqi-feedback-map-fjizi/embed/dashboards?id=f7a6ad78-27f9-457e-8f5e-64a105b715be&theme=light&autoRefresh=false&maxDataAge=-1&showTitleAndDesc=false&scalingWidth=scale&scalingHeight=fixed"></iframe> */}
    </div>
  );

};

export default Chart;