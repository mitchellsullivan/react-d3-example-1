import React from 'react';
import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import {WeatherDay} from '../types/data';
import {BarChartRectangle} from '../types/chart';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]).mode('hsl');

type BarChartHooksProps = {
  data: WeatherDay[]
}

const BarChartHooks: React.FC<BarChartHooksProps> = ({data}) => {
  const yAxisRef = React.useRef<SVGGElement>(null);
  const xAxisRef = React.useRef<SVGGElement>(null);

  const [bars, setBars] = React.useState<BarChartRectangle[]>([]);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const timeDomain = d3.extent(data, d => new Date(d.date)) as [Date, Date];
    const tempMax = d3.max(data, d => d.high) as number;
    const colorDomain = d3.extent(data, d => d.avg) as [number, number];

    const xScale = d3.scaleTime()
      .range([margin.left, width - margin.right])
      .domain(timeDomain);

    const yScale = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, tempMax]);

    const colorScale = d3.scaleLinear()
      .domain(colorDomain);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%b') as any);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => `${d}\u00B0F`);

    if (xAxisRef.current) {
      d3.select(xAxisRef.current).call(xAxis);
    }

    if (yAxisRef.current) {
      d3.select(yAxisRef.current).call(yAxis);
    }

    const bars: BarChartRectangle[] = data.map(d => {
      const y1 = yScale(d.high);
      const y2 = yScale(d.low);
      const scaledColor = colorScale(d.avg);
      const fill = colors(scaledColor);

      // console.log(`${scaledColor} ${fill}`)

      return {
        x: xScale(new Date(d.date)),
        y: y1,
        height: y2 - y1,
        fill,
      }
    });

    setBars(bars);


  }, [data]);

  return (
    <svg width={width} height={height}>
      {bars.map((d, i) =>
        (<rect key={i} x={d.x} y={d.y} width='2' height={d.height} fill={d.fill} />))}
      <g>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`}/>
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`}/>
      </g>
    </svg>
  );
}

export default BarChartHooks;
