import React, { useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import * as d3 from "d3";

const margin = { top: 70, right: 30, bottom: 40, left: 60 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const GET_TOTAL_XP = gql`
query {
    transaction(where: 
      {type: {_eq: "xp"}, 
      path: {_like: "/johvi/div-01/%", 
        _nlike: "%piscine-js%"}}, 
    ) {
        amount
        createdAt
        path
    }
}
`;

export const ProgressChart = () => {
  const { error, data, loading } = useQuery(GET_TOTAL_XP);
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (loading || !ref.current) return;
    const convertedData = [...data.transaction].map((item: any) => ({
      date: new Date(item.createdAt),
      value: item.amount
    }))
      .sort((a: { date: Date; value: number }, b: { date: Date; value: number }) => a.date.getTime() - b.date.getTime())
      .reduce((acc: { date: Date; value: number }[], curr: { date: Date; value: number }, idx: number) => {
        return [...acc, { date: curr.date, value: (acc[idx - 1]?.value || 0) + curr.value }];
      }, []);

    console.log(convertedData)

    const svg = d3.select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("stroke", "white")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

    x.domain([sixMonthsAgo, now]);

    const extent = d3.extent(convertedData, (d: { date: Date; value: number }) => d.date);
    x.domain([sixMonthsAgo, now]);

    const max = d3.max(convertedData, (d: { date: Date; value: number }) => d.value / 1000);
    y.domain([0, max !== undefined ? max : 1000]);

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat("%b %Y") as unknown as (n: Date | d3.NumberValue) => string);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g")
      .call(d3.axisLeft(y));

    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value / 1000))
      .curve(d3.curveStep);

    svg.append("path")
      .datum(convertedData)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("d", line);
  }, [loading, data]);

  if (loading) return <div>Loading...</div>

  return (
    <div className='flex justify-center'>
      <div className='bg-gray-800 lg:w-[600px] w-[650px] m-4 mb-0 flex flex-col'>
        <div className='w-full'>
          <p className='pl-8 pt-4 text-xl'>XP Progession</p>
        </div>
        <svg ref={ref} ></svg>
      </div>
    </div>
  )
}
