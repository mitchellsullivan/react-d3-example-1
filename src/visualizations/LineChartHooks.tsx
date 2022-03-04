import React from 'react';
import * as d3 from 'd3';
import {WeatherDay} from '../types/data';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const blue = '#52b6ca';

type LineChartHooksProps = {
  data: WeatherDay[]
}

const BarChartHooks: React.FC<LineChartHooksProps> = ({ data}) => {
  const yAxisRef = React.useRef<SVGGElement>(null);
  const xAxisRef = React.useRef<SVGGElement>(null);

  const [lowsPath, setLowsPath] = React.useState<string>("");
  const [highsPath, setHighsPath] = React.useState<string>("");

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const timeDomain = d3.extent(data, d => new Date(d.date)) as [Date, Date];
    const tempMax = d3.max(data, d => d.high) as number;

    const xScale = d3.scaleTime()
      .range([margin.left, width - margin.right])
      .domain(timeDomain);

    const yScale = d3.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, tempMax]);

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

    const lineGenerator = (x: number[][]) => {
      return d3.line()(x as [number, number][]) || "";
    }

    const lows =
      data.map(v => [xScale(new Date(v.date)), yScale(v.low)]);

    setLowsPath(lineGenerator(lows))

    const highs =
      data.map(v => [xScale(new Date(v.date)), yScale(v.high)]);

    setHighsPath(lineGenerator(highs));

  }, [data]);

  return (
    <svg width={width} height={height}>
      <path d={highsPath} fill='none' stroke={red} strokeWidth='2' />
      <path d={lowsPath} fill='none' stroke={blue} strokeWidth='2' />
      <g>
        <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`}/>
        <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`}/>
      </g>
    </svg>
  );
}

export default BarChartHooks;
