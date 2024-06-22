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
    <div style={{marginTop:"12px", width:"200px", borderBottom:"1px solid #777", paddingBottom:"12px"}}>
      <div style={{color:"#fff", position:"relative", bottom:"2px", fontSize:"12px"}}>{props.category}</div>
      <div style={{
        width:"200px", 
        height:"4px", 
        background: "#444", 
        marginTop:"2px", 
        marginBottom:"2px"}}>
        <div style={{
          width:props.testResults.length > 0 ? Math.round((numMatches / props.testResults.length)*200) +"px" : 0+"px",
          height:"4px", 
          background:"#bbb",}}></div>
      </div>
      <div style={{color:"#fff", fontSize:"12px"}}>
        
        <span style={{lineHeight:"12px", fontWeight:"300", color:"#fff"}}>
          {props.testResults.length > 0 ? Math.round((numMatches / props.testResults.length)*100) : 0}
        </span><span style={{fontSize:"12px", fontWeight:"300"}}> % </span>
      </div>

    </div>
  );
}

export default TestSummary;



