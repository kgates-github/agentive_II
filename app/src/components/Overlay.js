import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion"
import DetailsHeader from './DetailsHeader.js'
import DetailsBody from './DetailsBody.js'
import '../App.css';
import './SimulationCanvas.css';


function Overlay(props) {
  const [leftGap, setLeftGap] = useState(window.innerWidth / 3)
  const [detailsIsOpen, setDetailsIsOpen] = useState(false)
  const [detailsIsExpanded, setDetailsIsExpanded] = useState(false)
  const [detailsWidth, setDetailsWidth] = useState(400)

  const [testResult, setTestResult] = useState(false);
  const [content, setContent] = useState([]);
  const [curTab, setCurTab] = useState("simulation");
  const contentRef = useRef(content);
  
  function toggleMain() {
    if (leftGap == 12) setLeftGap(window.innerWidth / 3);
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

  const updateContent = (newContent) => {
    setContent(prevContent => [...prevContent, newContent]);
  }
  
  useEffect(() => {  
    if (props.overlayTestResultId) {
      const result = props.testResults.find(result => result.id === props.overlayTestResultId);
      setTestResult(result);
      setContent([])
    }
  }, [props.overlayTestResultId]);
  
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
          <div className="tab-control" style={{marginLeft:"10px", cursor:"pointer"}} onClick={() => props.setOverlayState("closed")}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"24px", lineHeight:"36px",}}>arrow_circle_right</i>  
          </div>
          <div style={{marginLeft:"12px", lineHeight:"36px",}}>
            Simulation
          </div>
          <div style={{flex:"1",}}></div>
          <div className="tab-control" style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} onClick={() => toggleMain()}>
            { leftGap == 12 ? 
              (<i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>close_fullscreen</i> )
              :
              (<i className="material-icons" style={{color: "#ddd", fontSize:"20px", lineHeight:"36px",}}>open_in_full</i> )
            }
          </div>   
        </div>
        <DetailsHeader 
          key={"details_header"} 
          name={"Human Experience"}
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
          width:"none",
          flex:"1",
          background:"none",
          flexDirection:"column"}}>
          <div style={{
              display: 'flex',
              width:"none",
              paddingTop:"2px",
              background:"none"
            }}>
              <div style={{
                height:"60px", width:"90px", display:"flex", flexDirection:"row",
                background:"#fff", alignItems:"center",
                paddingLeft:"16px", background:"none",
              }}>
                <div 
                onClick={() => {testResult.functionAgent.getFunctionCall(updateContent, props.promptQueue)}} 
                style={{
                  border:'1px solid #BEBEBE', width:"28px", height:"28px", cursor:"pointer",
                  borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px"}}>
                  <i className="material-icons" style={{color: "#555", fontSize:"15px", lineHeight:"28px"}}>play_arrow</i> 
                </div>
                <div 
                onClick={() => {setContent([])}} 
                style={{
                  border:'1px solid #BEBEBE', width:"28px", height:"28px", marginLeft:"8px", cursor:"pointer",
                  borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px"}}>
                  <i className="material-icons" style={{color: "#555", fontSize:"16px", lineHeight:"28px"}}>restart_alt</i> 
                </div>
                <div style={{flex:1}}></div>
              </div>
              <div style={{
                flex:1,
                display:"flex",
                padding:"12px", 
                textTransform:"uppercase", 
                fontWeight:"500",
                textAlign: "center",
                alignItems: 'center',
                justifyContent:"center",
                lineHeight:"14px"
              }}>
                {testResult.question}
              </div>
              <div style={{
                height:"60px", width:"90px", display:"flex",
                background:"#fff", paddingLeft:"0px", alignItems:"center",
                paddingLeft:"16px", background:"none",
              }}></div>
          </div>
          {/* SIMULATION RESULTS */}
           <div style={{
            marginTop:"16px",
            marginLeft:"0px",
            marginRight:"16px"
          }}>
            <ol style={{display:"flex", flexDirection:"column"}}>
              {Array.isArray(content) && content.map((item, index) => (
                <li key={"content_"+index}>
                  <span style={{textTransform:"uppercase", color:"#333", fontWeight:"300"}}>{item.type}: </span>{item.message}
                </li>
              ))}
            </ol>
          </div>
          {/* END SIMULATION */}
        </div>
        <DetailsBody 
          key={"detail_body"} 
          name={"Details"} 
          detailsWidth={detailsWidth} 
          detailsIsOpen={detailsIsOpen}
          detailsIsExpanded={detailsIsExpanded}
          content={content}
        />
      </div>
      {/* END OVERLAY BODY */}
    </motion.div>
   
  );
}

export default Overlay;



