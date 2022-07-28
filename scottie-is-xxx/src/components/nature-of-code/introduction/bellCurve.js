import React from 'react';
import BarChart from '../d3/barChart';

const BellCurve = () => {
    return (
        <div>
            <BarChart data={generateHeightBellCurve()} xAxisName={'standardDeviations'} yAxisName={'count'} />
        </div>
    );
}

const generateHeightData = () => {
    const data = [];
    const datasetSize = 1000;
    const baseHeight = 200;
    const maxRandomValue = 100;
    for(let index = 0; index < datasetSize; index++) {
        data[index] = {
            index: index,
            // generate a height between 200 and 300
            value: baseHeight + (Math.floor(Math.random() * maxRandomValue))
        }
    }
    return data.sort((current, next) => { return current.value - next.value });
}

const computeMean = (array) => {
    let sum = 0;
    for(let index = 0; index < array.length; index++) {
        sum += array[index].value;
    }
    return sum / array.length;
}

const computeStandardDeviation = (data, mean) => {
    let sumSquareDeviation = 0;
    for(let index = 0; index < data.length; index++) {
        sumSquareDeviation += Math.pow(data[index].value - mean, 2);
    }
    return Math.sqrt(sumSquareDeviation / data.length);
}

const generateHeightBellCurve = () => {
    const data = generateHeightData();
    const meanHeight = computeMean(data);
    const standardDeviationHeight = computeStandardDeviation(data, meanHeight);
    const bellCurveData = {};
    for(let index = 0; index < data.length; index++) {
        data[index].standardDeviations = Math.round((data[index].value - meanHeight) / standardDeviationHeight);
        if(!bellCurveData[data[index].standardDeviations]) {
            bellCurveData[data[index].standardDeviations] = {
                standardDeviations: data[index].standardDeviations,
                count: 1
            }
        }
        else {
            bellCurveData[data[index].standardDeviations].count++;
        }
    }
    return Object.keys(bellCurveData).map(key => bellCurveData[key]).sort((one, other) => { return one.standardDeviations - other.standardDeviations });
}

export default BellCurve;