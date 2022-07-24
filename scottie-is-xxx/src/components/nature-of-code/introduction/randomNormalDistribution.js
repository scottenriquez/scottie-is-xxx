import React from 'react';
import BarChart from '../d3/barChart';

const datasetSize = 100;
const maxValue = 100;

const RandomNormalDistribution = () => {
    return (
        <div>
            <BarChart data={generateRandomData()} xAxisName={'index'} yAxisName={'value'} />
        </div>
    );
}

const generateRandomData = () => {
    const data = [];
    for(let index = 0; index < datasetSize; index++) {
        data[index] = {
            index: index,
            value: Math.floor(Math.random() * maxValue)
        }
    }
    return data;
}

export default RandomNormalDistribution;