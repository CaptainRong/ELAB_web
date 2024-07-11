import React from 'react';

function Dot({color='rgba(255, 0, 0, 0.7)'}) {
  const badgeStyle = {
    backgroundColor: color,
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: '5px',
  };

  return (
    <span style={badgeStyle}></span>
  );
};

export default Dot;