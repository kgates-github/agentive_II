import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"
import DetailsHeader from './DetailsHeader.js'
import DetailsBody from './DetailsBody.js'
import '../App.css';
import './SimulationCanvas.css';


function Overlay(props) {
  const [leftGap, setLeftGap] = useState(400)
  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [detailsIsExpanded, setDetailsIsExpanded] = useState(false)
  const [detailsWidth, setDetailsWidth] = useState(400)
  
  function toggleMain() {
    if (leftGap == 12) setLeftGap(400);
    else setLeftGap(12)
  }

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
          <div style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} onClick={() => toggleMain()}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>open_in_full</i> 
          </div>
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
            height:"60px", width:"90px", display:"flex", flexDirection:"row",
            background:"#fff", paddingLeft:"0px", alignItems:"center",
            paddingLeft:"16px", background:"none",
          }}>
            <div style={{
              border:'1px solid #BEBEBE', width:"28px", height:"28px", 
              borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px"}}>
              <i className="material-icons" style={{color: "#555", fontSize:"15px", lineHeight:"28px"}}>play_arrow</i> 
            </div>
            <div style={{
              border:'1px solid #BEBEBE', width:"28px", height:"28px", marginLeft:"8px",
              borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px"}}>
              <i className="material-icons" style={{color: "#555", fontSize:"16px", lineHeight:"28px"}}>restart_alt</i> 
            </div>
            <div style={{flex:1}}></div>
          </div>
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
          <div style={{
            height:"60px", width:"90px", display:"flex", flexDirection:"row",
            background:"#fff", paddingLeft:"0px", alignItems:"center",
            paddingLeft:"16px", background:"none",
          }}></div>
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



