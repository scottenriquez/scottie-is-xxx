import React, {Component} from 'react';
import BarChart from '../d3/barChart';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";

class RandomNormalDistribution extends Component {
    generateRandomData = () => {
        const datasetSize = 100;
        const maxValue = 100;
        const data = [];
        for(let index = 0; index < datasetSize; index++) {
            data[index] = {
                index: index,
                value: Math.floor(Math.random() * maxValue)
            }
        }
        return data;
    }

    handleRefreshDataClick = (event) => {
        this.setState({ data: this.generateRandomData() });
    }

    constructor(props) {
        super(props);
        this.state = {
            data: this.generateRandomData()
        }
    }

    render() {
        return (
            <div>
                <button style={{ backgroundColor: '#8abeb7', color: 'black' }} onClick={this.handleRefreshDataClick}>
                    <FontAwesomeIcon icon={faRefresh} /> Generate New Data
                </button>
                <BarChart data={this.generateRandomData()} xAxisName={'index'} yAxisName={'value'} />
            </div>
        );
    }
}

export default RandomNormalDistribution;