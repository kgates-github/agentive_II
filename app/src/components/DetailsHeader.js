import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"
import '../App.css';
import './SimulationCanvas.css';


function DetailsHeader(props) {
  
  function toggleIsOpen() {
    props.setDetailsIsOpen(!props.detailsIsOpen)
  }

  function toggleIsExpanded() {
    props.setDetailsIsExpanded(!props.detailsIsExpanded)
  }

  function getWidth() {
    if (props.detailsIsOpen) {
      return (props.detailsIsExpanded) ? null : props.detailsWidth;
    }
    return null;
  }

  function getFlex() {
    if (props.detailsIsOpen) {
      return (props.detailsIsExpanded) ? '1' : null;
    }
    return null;
  }
   

  useEffect(() => { 
    
  }, []);
   

  return (
    <div 
    style={{
      display: 'flex',
      flex: getFlex(),
      flexDirection: "row",
      alignItems: 'center',
      height: '100vh',
      borderLeft:"1px solid #ccc", 
      width: getWidth(),
    }}>
      <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} 
        onClick={toggleIsOpen}>
          {props.name}
      </div>
      {props.detailsIsOpen ? (
        <>
          <div style={{flex:"1"}}></div>
          <div style={{marginLeft:"12px", cursor:"pointer"}} onClick={toggleIsExpanded}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>open_in_full</i> 
          </div>
          <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} 
            onClick={toggleIsOpen}>
            <i className="material-icons" style={{color: "#fff", fontSize:"20px", lineHeight:"28px"}}>close</i> 
          </div>
        </>
      ) : <></>}
    </div>
   
  );
}

export default DetailsHeader;



