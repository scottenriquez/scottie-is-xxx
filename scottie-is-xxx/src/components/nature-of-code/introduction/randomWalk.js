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
        this.randomWalk(this.props.weightedRight);
    }

    walk() {
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
        this.state.pixels.push({
            x: this.coordinates.x,
            y: this.coordinates.y
        });
    }

    walkWeightedRight() {
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
        this.state.pixels.push({
            x: this.coordinates.x,
            y: this.coordinates.y
        });
    }

    randomWalk(weightedRight) {
        while (this.coordinates.x < width - 1 && this.coordinates.x > 0 && this.coordinates.y < height - 1 &&
        this.coordinates.y > 0)
        {
            if (weightedRight) {
                this.walkWeightedRight();
            }
            else {
                this.walk();
            }
        }
        this.setState({walkComplete: true});
    }

    handleRefreshDataClick = (event) => {
        this.coordinates = {
            x: width / 2,
            y: height / 2,
        }
        this.state.pixels = [];
        this.randomWalk(this.props.weightedRight);
    }

    render() {
        return (
            <div>
                <button style={{ backgroundColor: '#b294bb', color: 'black' }} onClick={this.handleRefreshDataClick}>
                    <FontAwesomeIcon icon={faRefresh} /> Generate {this.props.buttonText}
                </button>
                <CartesianPlane pixels={this.state.pixels} />
            </div>
        );
    }
}

export default RandomWalk;