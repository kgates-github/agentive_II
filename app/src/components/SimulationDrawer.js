import React, { useEffect, useState } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import { motion } from "framer-motion"


function SimulationDrawer(props) {
  const [testResult, setTestResult] = useState(false)

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
      x: 1500,
      transition: { duration: 0.3, ease: 'easeInOut', }
    }
  }
  
  useEffect(() => {  
    if (props.drawerTestResultId) {
      const result = props.testResults.find(result => result.id === props.drawerTestResultId);
      console.log(result)
      setTestResult(result);
    }
  }, [props.drawerTestResultId]);
  
  return (
    <motion.div
      animate={props.drawerState}
      variants={variants}
      initial="closed"
      style={{
        position:"fixed",
        right:"0px",
        width:"1380px",
        height:"100%", 
        background:"#fff",
        borderLeft: "1px solid #888",
        boxShadow: "-8px 0px 8px rgba(0, 0, 0, 0.2)",
        zIndex:"100",
        display:"flex", 
        flexDirection:"row"
      }}
    >
      {/* LEFT SIDE */}
      <div style={{
        width:"380px", 
        marginRight:"40px", 
        borderRight:"1px solid #ccc", 
        height:"100%",
        paddingTop:"20px",
        paddingLeft:"32px",
        paddingRight:"32px",
        paddingBottom:"32px",
      }}
      >
        {/* HEADER */}
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <div style={{width:"120px"}}>
            <i 
              className="material-icons" 
              onClick={() => {
                props.setDrawerState('closed')
              }}
              style={{color: "#999", fontSize:"28px", cursor:"pointer", position:"relative", left:"-6px"}}
            >chevron_right</i>
          </div>
          <div style={{
            flex:"1", fontSize:"12px", color:"#333", fontWeight:"600"}}>
            DETAILS
          </div>
          <div onClick={() => {props.setDrawerState('open')}} 
            style={{cursor:"pointer"}}
          >
            <i className="material-icons" style={{color: "#999", fontSize:"28px" }}>arrow_circle_right</i> 
          </div>
        </div>
       
        <div style={{background:"none", marginTop:"40px"}}>
        {
          testResult ? Object.entries(testResult).map(([key, value], index) => (
            <div key={index} style={{display:"flex", flexDirection:"row", marginBottom:"12px"}}>
              <div style={{width:"120px", fontWeight:"500", color:"#666"}}>
                {`${key}`}:</div> <div style={{flex:"1"}}>{`${value}`}</div>
            </div>
          )) : null
        }
        </div>
      </div>
      {/* RIGHT SIDE */}
      <div style={{flex:"1", background:"#fff"}}>
        {/* LEFT SIDE */}
        <div style={{
          marginRight:"40px", 
          height:"100%",
          paddingTop:"20px",
          paddingLeft:"0px",
          paddingRight:"32px",
          paddingBottom:"32px",
          background:"none",
        }}
        >
          {/* HEADER */}
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <div style={{width:"120px"}}>
              <i 
                className="material-icons" 
                onClick={() => {
                  props.setDrawerState('partial')
                }}
                style={{color: "#999", fontSize:"28px", cursor:"pointer", position:"relative", left:"-6px"}}
              >chevron_right</i>
            </div>
            <div style={{
              flex:"1", fontSize:"12px", color:"#333", fontWeight:"600"}}>
              SIMULATION
            </div>
          </div>
          
          

          <div style={{}}>
            <div 
              style={{  
                marginLeft:"0px", 
                marginRight:"28px",  
                paddingRight:"36px",           
                cursor:"pointer",
                display:"flex",
                flexDirection:"row",
                alignItems:"center",
              }}
            >
              <div onClick={() => {alert(testResult.functionAgent.getAgentClass())}} style={{marginTop:"12px",}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>play_circle</i> 
                </div>
                <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Start</div>
              </div>
              <div onClick={() => {}} style={{marginLeft:"20px",marginTop:"12px",}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>replay</i> 
                </div>
                <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Reset</div> 
              </div>
            </div>
          </div>
        

        {/* END MAIN */}
        </div>
      </div>
      
    </motion.div>
  );
}

export default SimulationDrawer;
