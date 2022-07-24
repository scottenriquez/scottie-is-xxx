import * as d3 from 'd3';
import React from 'react';
import { useD3 } from '../hooks/useD3';

function BarChart({ data, xAxisName, yAxisName }) {
    const ref = useD3(
        (svg) => {
            const height = 400;
            const width = 800;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };

            const x = d3
                .scaleBand()
                .domain(data.map((d) => d[xAxisName]))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const y1 = d3
                .scaleLinear()
                .domain([0, d3.max(data, (d) => d[yAxisName])])
                .rangeRound([height - margin.bottom, margin.top]);

            const xAxis = (g) =>
                g
                    .attr('transform', `translate(0,${height - margin.bottom})`).call(
                    d3
                        .axisBottom(x)
                        .tickValues(
                            d3
                                .ticks(...d3.extent(x.domain()), width / 40)
                                .filter((v) => x(v) !== undefined)
                        )
                        .tickSizeOuter(0))
                    .style('color', '#8abeb7');

            const y1Axis = (g) =>
                g
                    .attr('transform', `translate(${margin.left},0)`)
                    .style('color', '#8abeb7')
                    .call(d3.axisLeft(y1).ticks(null, 's'))
                    .call((g) => g.select('.domain').remove())
                    .call((g) =>
                        g
                            .append('text')
                            .attr('x', -margin.left)
                            .attr('y', 10)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text(data.y1)
                    );

            svg.select('.x-axis').call(xAxis);
            svg.select('.y-axis').call(y1Axis);

            svg
                .select('.plot-area')
                .attr('fill', '#8abeb7')
                .selectAll('.bar')
                .data(data)
                .join('rect')
                .attr('class', 'bar')
                .attr('x', (d) => x(d[xAxisName]))
                .attr('width', x.bandwidth())
                .attr('y', (d) => y1(d[yAxisName]))
                .attr('height', (d) => y1(0) - y1(d[yAxisName]));
        },
        [data.length]
    );

    return (
        <svg
            ref={ref}
            style={{
                height: '100%',
                width: '100%',
                marginRight: '0px',
                marginLeft: '0px',
            }}
            viewBox={"0 0 800 400"}
        >
            <g className='plot-area' />
            <g className='x-axis' />
            <g className='y-axis' />
        </svg>
    );
}

export default BarChart;