import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion"
import PanelHeader from './PanelHeader.js'
import '../App.css';
import './SimulationCanvas.css';


function Overlay(props) {
  const leftGap = 250;

  // Variants
  const variants = {
    closed: {
      left: window.innerWidth,
      right: (window.innerWidth - leftGap) * -1,
    },
    partial: {
      left: leftGap,
      right: 12,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      left: 12,
      right: 12,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
  }

  useEffect(() => { 
   
  }, []);
  
  return (
    <motion.div 
    animate={props.overlayState}
    variants={variants}
    initial="partial"
    style={{
      position:"absolute", bottom:"12px", right:"16px", top:"36px", left:"240px",
      background:"none", display:"flex", flexDirection:"column", overflow:"hidden",
      borderBottom:"1px solid #ccc"
    }}>
      {/* HEAD */}
      <div style={{
        borderLeft:"1px solid #ccc",
        height:"36px", display:"flex", flexDirection:"row",
        background:"#757575", alignItems:"center", color:"#fff"}}
      >
         <div style={{ 
          display: 'flex',
          flexDirection: "row",
          alignItems: 'center',
          height: '100vh',
          width:"none",
          flex:"1",
        }}>
          <div style={{marginLeft:"10px", cursor:"pointer"}} onClick={() => props.setOverlayState("closed")}>
            <i className="material-icons" style={{
              color: "#fff", fontSize:"20px", lineHeight:"36px"}}>keyboard_tab</i> 
          </div>
          <div style={{marginLeft:"12px", lineHeight:"36px",}}>
            Simulation
          </div>
          <div style={{flex:"1",}}></div>
        </div>

        <PanelHeader name="Agent Inspector" width={300}/>
        <PanelHeader name="Human Experience" width={300}/>

      </div>
      
      {/* OVERLAY BODY */}
      <div style={{
        borderLeft:"1px solid #ccc",
        flex:1, overflowY:"scroll", 
        background:"white", display:"flex", flexDirection:"row",
      }}>
        <div style={{
          display: 'flex',
          height: '100vh',
          borderLeft:"0px solid #ccc", 
          width:"none",
          flex:"1",
          background:"none"
        }}>
          <div style={{
            flex:1,
            padding:"12px", 
            textTransform:"uppercase", 
            fontWeight:"600",
            textAlign: "center",
            alignItems: 'center',
          }}>
              Should I wear a coat tomorrow?
          </div>
        </div>

        <div style={{ 
          display: 'flex',
          height: '100vh',
          borderLeft:"1px solid #ccc", 
          width:"none",
          flex:"1",
          background:"none"
        }}>
          <div style={{padding:"12px"}}>Agent Inspector</div>
        </div>

        <div style={{
          display: 'flex',
          height: '100vh',
          borderLeft:"1px solid #ccc", 
          width:"300px",
          flex:"none",
          background:"none"
        }}>
          <div style={{padding:"12px"}}>Human Experience</div>
        </div>
        
      </div>
      {/* END OVERLAY BODY */}
    </motion.div>
   
  );
}

export default Overlay;



