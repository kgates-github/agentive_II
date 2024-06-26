import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';


function PanelHeader(props) {
  let baseWidth = 0;
  const tabRef = useRef();

  function getWidth() {
    if (props.data.isOpen) {
      let newWidth = 0
      if (props.data.isExpanded) newWidth = props.data.widthLarge;
      newWidth = props.data.widthSmall;
      const offset = props.getOffset(props.index)
    }
    return null;
  }

  useEffect(() => { 
    baseWidth = tabRef.current.offsetWidth;
    console.log('baseWidth', tabRef.current.offsetWidth)
  }, []);
   

  
  return (
    <div ref={tabRef} style={{
      display: 'flex',
      flexDirection: "row",
      alignItems: 'center',
      height: '100vh',
      borderLeft:"1px solid #ccc", 
      width: getWidth(),
    }}>
      <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} 
        onClick={() => props.upDatePanelsData(props.index, "isOpen")}>
          {props.data.name}
      </div>
      {props.data.isOpen ? (
        <>
          <div style={{flex:"1"}}></div>
          <div style={{marginLeft:"12px", cursor:"pointer"}} onClick={() => props.upDatePanelsData(props.index, "isExpanded")}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>open_in_full</i> 
          </div>
          <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} 
            onClick={() => props.upDatePanelsData(props.index, "isOpen")}>
            <i className="material-icons" style={{color: "#fff", fontSize:"20px", lineHeight:"28px"}}>close</i> 
          </div>
        </>
      ) : <></>}
    </div>
   
  );
}

export default PanelHeader;



