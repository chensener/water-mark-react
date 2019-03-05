import React,{ Component } from 'react';
import styled from 'styled-components';


const Root = styled.div``;

function drawPattern(watermarkInfo) {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.style.display = 'none';
  canvas.width = '160';
  canvas.height = '80';

  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.translate(80, 40);
  ctx.rotate(-30 * (Math.PI / 180));
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(205, 205, 205, 0.5)';
  ctx.fillText(watermarkInfo, 0, 0);

  return new Promise((resolve, reject) => {
    if(window['@waterInfo']) {
      resolve(window['@waterInfo']);
    }
    if (process.env.NODE_ENV === 'development') {
      canvas.toBlob((blob) => {
        window['@waterInfo'] = URL.createObjectURL(blob);
        resolve(window['@waterInfo']);
      });
    } else {
      window['@waterInfo'] = canvas.toDataURL();
      resolve(window['@waterInfo']);
    }
  });
}
class Watermark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singature: '',
    }
  }
  componentDidMount() {
    drawPattern('开发环境').then((blob) => {
      this.setState({
        signature: blob,
      });
    });
  }

  render() {
    const { signature } = this.state;
    const ContainerStyle = {
      backgroundImage: `url('${signature}')`,
      backgroundRepeat: 'space repeat',
    };
    return(
      <Root style={ContainerStyle}>
        {this.props.children()}
      </Root>
    );
  }
}
export default Watermark;