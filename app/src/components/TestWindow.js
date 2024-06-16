import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import Overlay from './Overlay';
import { motion } from "framer-motion"


function TestWindow(props) {
  const [overlayState, setOverlayState] = useState("closed")

  // Variants
  const variants = {
    dormant: {
      x: 0,
    },
    partial: {
      x: 938,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      x: 600,
      transition: { duration: 0.3, ease: 'easeInOut', }
    }
  }

  function openOverlay(id) {
    setOverlayState("partial")
  }
  
  
  useEffect(() => {  
    
  }, []);
  
  return (
    <div style={{width:"100%", height:"100vh", background:"#fff", display:"flex", flexDirection:"column"}}>
      <div style={{height:"36px", background:"#fff", color:"#333", textAlign:"center", lineHeight:"36px"}}>
        Agentic II
      </div>

      {/* TABLE */}
      <div style={{width:"100%", flex:1, background:"#fff", 
        borderLeft:"1px solid #ccc", borderRight:"1px solid #ccc", 
        borderBottom:"1px solid #ccc", marginBottom:"12px",
        display:"flex", flexDirection:"column", overflow:"hidden"
      }}>
        {/* TABLE HEAD */}
        <div style={{
          width:"100%", height:"36px", display:"flex", flexDirection:"row",
          background:"#757575", paddingLeft:"4px"}}
        >
          <div style={{
            background:"#fff", marginTop:"6px", paddingLeft:"20px", paddingRight:"20px",
            fontWeight:"500", lineHeight:"30px", marginLeft:"6px",
            borderTopLeftRadius:"2px", borderTopRightRadius:"2px",
            textAlign:"center", color:"#333"}}>
            Test Batch One
          </div>
          <div style={{
            background:"#DCDCDC", marginTop:"6px", paddingLeft:"20px", paddingRight:"20px",
            fontWeight:"500", lineHeight:"30px", marginLeft:"6px",
            borderTopLeftRadius:"2px", borderTopRightRadius:"2px",
            textAlign:"center", color:"#333"}}>
            Test Batch Two
          </div>
          <div style={{paddingTop:"8px", paddingLeft:"4px"}}>
            <i className="material-icons" style={{color: "#fff", fontSize:"20px"}}>add</i> 
          </div>
          <div style={{"flex":1}}></div>

        </div>
        
        {/* TAB HEAD */}
        <div style={{
          width:"100%", height:"60px", display:"flex", flexDirection:"row",
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
        {/* TABLE */}
        
        <div style={{flex:1, overflowY:"scroll", background:"white"}}>
          <table className="testTable">
            <thead>
              <tr className="tr_header">
                <td>#</td>
                <td>Question</td>
                <td>Label</td>
                <td>LLM Guess</td>
                <td>Match</td>
                <td>False Positive</td>
                <td>Letter</td>
                <td>Duration</td>
                {/*<td>Message</td>*/}
                <td>Agent</td>
                <td>State</td>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((result, index) => (
                <tr className="tr_data">
                  <td>#</td>
                  <td onClick={() => openOverlay(1)} style={{cursor:"pointer"}}>Should I weat a coat tomorrow?</td>
                  <td>Weather</td>
                  <td>Weather</td>
                  <td>Y</td>
                  <td>T</td>
                  <td>a</td>
                  <td>650ms</td>
                  {/*<td>Message</td>*/}
                  <td>FunctionCaller</td>
                  <td>-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* END */}
      
      <Overlay overlayState={overlayState} setOverlayState={setOverlayState} />

    </div>
  );
}

export default TestWindow;


{/* 
 
*/}