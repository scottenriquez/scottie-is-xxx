import React, {Component} from 'react';

class CartesianPlane extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const pixelRectangles = [];
        for(let index = 0; index < this.props.pixels.length; index++) {
            const pixel = this.props.pixels[index];
            pixelRectangles.push(<rect key={Math.random() * 10000000} x={pixel.x} y={pixel.y} width={1} height={1} style={{fill: 'rgb(178, 148, 187)'}} />);
        }
        return (
            <div>
                <svg
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
                    {pixelRectangles}
                </svg>
            </div>
        );
    }
}

export default CartesianPlane;