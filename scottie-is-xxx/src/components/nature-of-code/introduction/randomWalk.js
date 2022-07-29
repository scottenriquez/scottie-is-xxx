import React, { Component } from 'react';
import CartesianPlane from '../d3/cartesianPlane';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRefresh} from "@fortawesome/free-solid-svg-icons";

const width = 800;
const height = 400;

class RandomWalk extends Component {
    constructor(props) {
        super(props);
        this.coordinates = {
            x: width / 2,
            y: height / 2,
        }
        this.state = {
            pixels: []
        }
        this.randomWalk(this.props.weightedRight).then((response) => {
            this.setState({
                pixels: response.pixels
            });
        });
    }

    walk(pixels) {
        const step = Math.floor(Math.random() * 4);
        switch (step) {
            case 0:
                this.coordinates.x++;
                break;
            case 1:
                this.coordinates.x--;
                break;
            case 2:
                this.coordinates.y++;
                break;
            default:
                this.coordinates.y--;
                break;
        }
        pixels.push({
            x: this.coordinates.x,
            y: this.coordinates.y
        });
    }

    walkWeightedRight(pixels) {
        const step = Math.floor(Math.random() * 10);
        if (step <= 6) {
            this.coordinates.x++;
        }
        else if (step === 7) {
            this.coordinates.x--;
        }
        else if (step === 8) {
            this.coordinates.y++;
        }
        else {
            this.coordinates.y--;
        }
        pixels.push({
            x: this.coordinates.x,
            y: this.coordinates.y
        });
    }

    randomWalk(weightedRight) {
        return new Promise((resolve) => {
            const pixels = [];
            while (this.coordinates.x < width - 1 && this.coordinates.x > 0 && this.coordinates.y < height - 1 &&
            this.coordinates.y > 0)
            {
                if (weightedRight) {
                    this.walkWeightedRight(pixels);
                }
                else {
                    this.walk(pixels);
                }
            }
            resolve({
                pixels: pixels
            });
        });
    }

    handleRefreshDataClick = (event) => {
        this.coordinates = {
            x: width / 2,
            y: height / 2,
        }
        this.randomWalk(this.props.weightedRight).then((response) => {
            this.setState({
                pixels: response.pixels
            });
        });
    }

    render() {
        const refreshButton = this.props.weightedRight ? <button style={{ backgroundColor: '#b294bb', color: 'black' }} onClick={this.handleRefreshDataClick}><FontAwesomeIcon icon={faRefresh} /> Generate {this.props.buttonText}</button> : <></>;
        return (
            <div>
                {refreshButton}
                <CartesianPlane pixels={this.state.pixels} />
            </div>
        );
    }
}

export default RandomWalk;