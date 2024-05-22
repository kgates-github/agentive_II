import React, { useState, useEffect } from 'react';
import '../App.css';
import '../Workflow.css';

function CardOutput(props) {


  return (
    <div style={{ 
      background:"white",
      width:"190px",
      height:"320px",
      boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.2)", 
      borderRadius: "8px", 
      border: "1px solid #ddd",
      padding:"8px",
      display:"flex",
      flexDirection:"column",
    }}>
      <div style={{color:"#999", marginBottom:"8px", textTransform: "uppercase"}}>Output</div>
      <div style={{
        flex:1,
        border:"1px solid #ddd", fontFace:"Source Code Pro", background:"none",
        borderRadius:"2px", fontSize:"11px", whiteSpace: "pre-wrap"}} 
      >
        Output
      </div>
      <div style={{marginTop:"8px", display:"flex", justifyContent:"space-between"}}>
        <div style={{color:"#999", textTransform: "uppercase"}}>Output</div>
        {/*<button style={{background:"#eee", color:"#000", border:"none", padding:"2px 8px", borderRadius:"4px"}}>Run</button>*/}
      </div>
    </div>
  );
}

export default CardOutput;