import * as d3 from 'd3';
import React, {Component} from 'react';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.updateSVG();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateSVG();
    }

    updateSVG = () => {
        const svg = d3.select(this.ref.current);
        const height = 400;
        const width = 800;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const x = d3
            .scaleBand()
            .domain(this.props.data.map((d) => d[this.props.xAxisName]))
            .rangeRound([margin.left, width - margin.right])
            .padding(0.1);
        const y1 = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, (d) => d[this.props.yAxisName])])
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
                        .text(this.props.data.y1)
                );
        svg.select('.x-axis').call(xAxis);
        svg.select('.y-axis').call(y1Axis);
        svg
            .select('.plot-area')
            .attr('fill', '#8abeb7')
            .selectAll('.bar')
            .data(this.props.data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', (d) => x(d[this.props.xAxisName]))
            .attr('width', x.bandwidth())
            .attr('y', (d) => y1(d[this.props.yAxisName]))
            .attr('height', (d) => y1(0) - y1(d[this.props.yAxisName]));
    }

    render() {
        return (
            <div>
                <svg
                    ref={this.ref}
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
            </div>
        );
    }
}

export default BarChart;