import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';


function DetailsBody(props) {
  useEffect(() => { 
    
  }, []);

  function getDisplay() {
    return (props.detailsIsOpen) ? 'flex' : 'none';
  }

  function getFlex() {
    return (props.detailsIsExpanded) ? '1' : null;
  }

  function getWidth() {
    return (props.detailsIsExpanded) ? null : props.detailsWidth;
  }
   

  return (
    <>
      {props.detailsIsOpen ? (
       <div style={{
        display: getDisplay(),
        flex: getFlex(),
        height: '100vh',
        borderLeft:"1px solid #ccc", 
        width: getWidth(),
        
      }}>
        <div style={{margin:"12px"}}>DETAILS</div>
        
      </div>
      ) : <></>}
   </>
  );
}

export default DetailsBody;



