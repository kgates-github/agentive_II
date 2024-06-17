import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"
import DetailsHeader from './DetailsHeader.js'
import DetailsBody from './DetailsBody.js'
import '../App.css';
import './SimulationCanvas.css';


function Overlay(props) {
  const leftGap = 250;
  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [detailsIsExpanded, setDetailsIsExpanded] = useState(false)
  const [detailsWidth, setDetailsWidth] = useState(400)
  

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
      borderBottom:"1px solid #ccc", borderRight:"1px solid #ccc", 
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

        
          <DetailsHeader 
            key={"details_header"} 
            name={"Details"}
            detailsWidth={detailsWidth}
            setDetailsWidth={setDetailsWidth}
            detailsIsOpen={detailsIsOpen} 
            setDetailsIsOpen={setDetailsIsOpen}
            detailsIsExpanded={detailsIsExpanded}
            setDetailsIsExpanded={setDetailsIsExpanded}
          />
        

      </div>
      
      {/* OVERLAY BODY */}
      <div style={{
        borderLeft:"1px solid #ccc",
        flex:1, overFlow:"hidden",
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

       
        <DetailsBody 
          key={"detail_body"} 
          name={"Details"} 
          detailsWidth={detailsWidth} 
          detailsIsOpen={detailsIsOpen}
          detailsIsExpanded={detailsIsExpanded}
        />
      </div>
      {/* END OVERLAY BODY */}
    </motion.div>
   
  );
}

export default Overlay;



