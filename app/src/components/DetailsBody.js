import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';


function DetailsBody(props) {
  const [uxContent, setUxContent] = useState([])

  useEffect(() => { 
    setUxContent(
      props.content.filter((item) => item.type=="chat bot" || item.type=="user")
    )
  }, [props.content]);

  function getDisplay() {
    return (props.detailsIsOpen) ? 'flex' : 'none';
  }

  function getFlex() {
    return (props.detailsIsExpanded) ? '1' : null;
  }

  function getWidth() {
    return (props.detailsIsExpanded) ? null : props.detailsWidth;
  }
   

  return (
    <>
      {props.detailsIsOpen ? (
       <div style={{
        display: getDisplay(),
        flex: getFlex(),
        height: '100vh',
        borderLeft:"1px solid #ccc", 
        width: getWidth(),
        
      }}>
        <div>
          <div style={{margin:"16px", width:"100px", height:"100px", background:"#eee"}}></div>
          {/* SIMULATION RESULTS */}
          <div style={{
              marginTop:"40px",
              marginLeft:"16px",
              marginRight:"16px",
              //lineHeight:"auto"
            }}>
              <div style={{display:"flex", flexDirection:"column"}}>
                {Array.isArray(uxContent) && uxContent.map((item, index) => (
                  <div key={"content_"+index} style={{marginBottom:"28px"}}>
                    <div style={{textTransform:"uppercase", marginBottom:"-2px", color:"#333", fontWeight:"300"}}>{item.type}</div>
                    <div style={{textTransform:"none", marginBottom:"8px", color:"#333", fontSize:"11px"}}>546 ms</div>
                    {item.message}
                  </div>
                ))}
              </div>
            </div>
            {/* END SIMULATION */}
          </div>
        </div>
      ) : <></>}
   </>
  );
}

export default DetailsBody;



