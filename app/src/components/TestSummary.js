import React, { useEffect, useState } from 'react';
import '../App.css';
import './SimulationCanvas.css';


function TestSummary(props) {
  const [numMatches, setNumMatches] = useState(0)

  useEffect(() => { 
    if (props.testResults.length) {
      const matches = props.testResults.filter((testResult) => testResult.isMatch)
      setNumMatches(matches.length);
    }
  }, [props.testResults]);
  
  return (
    <div style={{marginLeft:"20px", width:"100px", }}>
      <div style={{color:"#444", position:"relative", bottom:"-3px", fontSize:"12px"}}>{props.category}</div>
      <div style={{background:"none", }}>
        <span style={{letterSpacing: "-1.5px", lineHeight:"16px", fontSize:"16px", fontWeight:"600", color:"#888"}}>
          {props.testResults.length > 0 ? Math.round((numMatches / props.testResults.length)*100) : 0}
        </span><span style={{fontSize:"16px",}}> %</span>
      </div>
      <div style={{
        width:"100px", 
        height:"6px", 
        background: "#ddd", 
        marginTop:"2px", 
        marginBottom:"2px"}}>
        <div style={{
          width:props.testResults.length > 0 ? Math.round((numMatches / props.testResults.length)*100) +"px" : 0+"px",
          height:"6px", 
          background:"#aaa",}}></div>
      </div>
      <div style={{color:"#444", fontSize:"12px"}}>
        {numMatches} of {props.testResults.length}
      </div>

    </div>
  );
}

export default TestSummary;



