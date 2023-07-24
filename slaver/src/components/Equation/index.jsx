import React from 'react';

const Equation = React.memo(({ str }) => {
  const handleEquation = (data) => {
    let dom = data;
    const name = data?.toLocaleUpperCase();
    switch (name) {
      case 'CO2':
        dom = (<div>CO<sub>2</sub></div>);
        break;
      case '非CO2':
        dom = (<div>非CO<sub>2</sub></div>);
        break;
      case 'SO2':
        dom = (<div>SO<sub>2</sub></div>);
        break;
      case 'NOX':
        dom = (<div>NO<sub>x</sub></div>);
        break;
      case 'NH3-N':
        dom = (<div>NH<sub>3</sub>-N</div>);
        break;
      case 'COD':
        dom = <div>COD</div>;
        break;
      case 'N2O':
        dom = (<div>N<sub>2</sub>O</div>);
        break;
      case 'CH4':
        dom = (<div>CH<sub>4</sub></div>);
        break;
      case 'SF6':
        dom = (<div>SF<sub>6</sub></div>);
        break;
      case 'PM2.5':
        dom = (<div>PM<sub>2.5</sub></div>);
        break;
      default:
        break;
    }
    return dom;
  };

  return handleEquation(str);
});

export default Equation;
