import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import { motion } from "framer-motion"


function SimulationDrawer(props) {
  const [testResult, setTestResult] = useState(false);
  const [content, setContent] = useState([]);
  const [curTab, setCurTab] = useState("simulation");
  const contentRef = useRef(content);

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

  const updateContent = (newContent) => {
    setContent(prevContent => [...prevContent, newContent]);
  }
  
  useEffect(() => {  
    if (props.drawerTestResultId) {
      const result = props.testResults.find(result => result.id === props.drawerTestResultId);
      setTestResult(result);
      setContent([])
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
        width:"600px",
        height:"100%", 
        background:"#fff",
        borderLeft: "1px solid #888",
        boxShadow: "-8px 0px 8px rgba(0, 0, 0, 0.2)",
        zIndex:"100",
        display:"flex", 
        flexDirection:"row"
      }}
    >
      {/* MAIN */}
      <div style={{
        flex:"1", 
        marginRight:"40px", 
        height:"100vh",
        width:"100%",
        paddingTop:"20px",
        paddingLeft:"32px",
        paddingRight:"32px",
        paddingBottom:"44px",
      }}
      >
        {/* HEADER */}
        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
          <div style={{width:"28px"}}>
            <i 
              className="material-icons" 
              onClick={() => {
                props.setDrawerState('closed')
              }}
              style={{
                color: "#999", 
                fontSize:"28px", 
                cursor:"pointer", 
                position:"relative", 
                left:"-12px",
                top:"2px",
              }}
            >chevron_right</i>
          </div>
          <div>{testResult['question']}</div>
          <div style={{flex:1}}></div>
        </div>
        <div style={{display:"flex", flexDirection:"row", marginTop:"24px"}}>
          <div style={{width:"28px"}}></div>
          <div 
            onClick={() => setCurTab("simulation")}
            style={{
              width:"100px", 
              fontSize:"12px", 
              color:"#333", 
              fontWeight:"600", 
              borderTop: curTab == 'simulation' ? "3px solid #333" : "3px solid #fff" ,
              textAlign:"center",
              marginRight:"16px",
              paddingTop:"6px",
              cursor:"pointer",
            }}>
            SIMULATION
          </div>
          <div 
            onClick={() => setCurTab("details")}
            style={{
              width:"100px", 
              fontSize:"12px", 
              color:"#333", 
              fontWeight:"600", 
              borderTop: curTab == 'details' ? "3px solid #333" : "3px solid #fff" ,
              textAlign:"center",
              marginRight:"16px",
              paddingTop:"6px",
              cursor:"pointer",
            }}>
            DETAILS
          </div>
        </div>

        {/* SIMULATION */}
        <div style={{
          marginTop:"16px",
          marginLeft:"0px",
          border: "3px solid white",
          display: curTab == 'simulation' ? "flex" : "none" ,
          flexDirection:"row",
        }}>
          <div 
            style={{  
              marginLeft:"0px", 
              marginRight:"28px",  
              paddingRight:"0px",           
              display:"flex",
              flexDirection:"column",
              alignItems:"flex-start",
              background:"none",
            }}
          >
            <div style={{marginTop:"12px",}}>
              <div onClick={() => {testResult.functionAgent.getFunctionCall(updateContent)}}  
                style={{ cursor:"pointer",}}>
                <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>play_circle</i> 
              </div>
              <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Start</div>
            </div>
            <div onClick={() => {}} style={{marginTop:"12px",}}>
              <div onClick={() => {setContent([])}}  
                style={{ cursor:"pointer",}}>
                <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>replay</i> 
              </div>
              <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Reset</div> 
            </div>
          </div>
          
          <ol style={{display:"flex", flexDirection:"column"}}>
            {Array.isArray(content) && content.map((item, index) => (
              <li key={"content_"+index}>
                {item}
              </li>
            ))}
          </ol>
          
        {/* END MAIN */}
        </div>

        {/* DETAILS */}
        <div style={{
          background:"none", 
          marginTop:"40px",
          display: curTab == 'details' ? "block" : "none" ,
        }}>
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
      
    </motion.div>
  );
}

export default SimulationDrawer;


{/* 
 
*/}