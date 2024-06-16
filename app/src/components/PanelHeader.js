import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import '../App.css';
import './SimulationCanvas.css';


function PanelHeader(props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  function toggleIsExpanded() {
    setIsExpanded(!isExpanded);
  }

  function getFlex() {
    if (!isOpen) return null
    if (isExpanded) return "1";
    return null
  }

  function getWidth() {
    if (!isOpen) return null;
    if (isExpanded) return null
    return props.width + "px";
  }
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: "row",
      alignItems: 'center',
      height: '100vh',
      borderLeft:"1px solid #ccc", 
      width: getWidth(),
      flex: getFlex(),
    }}>
      <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} onClick={toggleIsOpen}>{props.name}</div>
      {isOpen ? (
        <>
          <div style={{flex:"1"}}></div>
          <div style={{marginLeft:"12px", cursor:"pointer"}} onClick={toggleIsExpanded}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>open_in_full</i> 
          </div>
          <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} onClick={toggleIsOpen}>
            <i className="material-icons" style={{color: "#fff", fontSize:"20px", lineHeight:"28px"}}>close</i> 
          </div>
        </>
      ) : <></>}
    </div>
   
  );
}

export default PanelHeader;



