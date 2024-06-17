import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';


function PanelBody(props) {
  
  return (
    <div 
    style={{ 
      display: props.data.isOpen ? 'flex' : 'none',
      height: '100vh',
      borderLeft:"1px solid #ccc", 
      width: props.data.isExpanded ? props.data.widthLarge : props.data.widthSmall,
      background:"none"
    }}>
      <div style={{padding:"12px"}}>{props.data.name}</div>
    </div>
   
  );
}

export default PanelBody;



