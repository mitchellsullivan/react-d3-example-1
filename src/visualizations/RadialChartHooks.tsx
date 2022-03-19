import React, { Component } from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import {WeatherDay} from "../types/data";

const width = 650;
const height = 650;
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

type RadialChartHooksProps = {
  data: WeatherDay[]
}

type PieSlice = {
  path: string,
  fill: any
}

type TempAnnotation = {
  r: number,
  temp: number
}

const RadialChartHooks: React.FC<RadialChartHooksProps> = ({ data}) => {
  const [slices, setSlices] = React.useState<PieSlice[]>([]);
  const [tempAnnotations, setTempAnnotations] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const tempMax = d3.max(data, d => d.high) as number;
    const colorDomain = d3.extent(data, d => d.avg) as [number, number];

    const radiusScale = d3.scaleLinear()
      .range([0, width / 2])
      .domain([0, tempMax]);

    const colorScale = d3.scaleLinear()
      .domain(colorDomain);

    const arcGenerator = d3.arc();

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const perSliceAngle = (2 * Math.PI) / data.length;

    const slices: PieSlice[] = data.map((d, i) => {
      const path = arcGenerator({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high),
      }) || "";

      return {
        path,
        fill: colors(colorScale(d.avg))
      };
    });

    const tempAnnotations: TempAnnotation[] = [5, 20, 40, 60, 80]
      .map(temp => ({
        r: radiusScale(temp),
        temp
      })
    );

    setSlices(slices);
    setTempAnnotations(tempAnnotations);

  }, [data]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {
          slices.map((d, i) =>
            (<path key={i} d={d.path} fill={d.fill} />))
        }
        {
          tempAnnotations.map((d, i) => (
          <g key={i}>
            <circle r={d.r} fill='none' stroke='#999' />
            <text y={-d.r - 2} textAnchor='middle'>{d.temp}</text>
          </g>
        ))
        }
      </g>
    </svg>
  );
}

export default RadialChartHooks;
