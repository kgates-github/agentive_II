import React, { useState, useEffect } from 'react';
import '../App.css';
import './SimulationCanvas.css';

function SimulationCanvas(props) {

  const [question, setQuestion] = useState(null)
  const [message, setMessage] = useState(null)

  const actions = {
    'a': "Function call about the location or directions",
    'b': "Function call about the weather",
    'c': "Function call about a person",
    'd': "No function call",
  }
  
  function routeInput(event) {
    setQuestion(event.target.innerText)
    setMessage("...")

    const prompt = `First, read the following text: ${event.target.innerText}
    
    Next, read through all of the categories found below and list the letter of the category that best describes the text like this: {a}. Make sure your answer is less than 10 words max.
    
    CATEGORIES:
    a) The text is about location or travel directions.
    b) The text is about the weather.
    c) The text is about a person.
    d) The text is NOT location or travel directions and is NOT about the weather.`

    const callback = (msg) => {
      const matches = msg.match(/[a-dA-D]{1}(?=[\}\)])/g);
      console.log(msg)
      if (matches && matches[0] in actions) {
        if (matches[0] == 'd') setMessage("No matches");
        else setMessage(actions[matches[0]]);
      } else {
        setMessage("No matches");
      }
    }
    props.promptQueue.addPromptRequest(prompt, callback) 
  }

  return (
    <div style={{
      background:"#eee",
      height:"100vh", 
      display:"flex",
      flexDirection:"column",
    }}>
      <div className="header" style={{background:"none",}}>
        <div style={{flex:1}}></div>
        <div className="title">
          <div className="header-06" style={{color:"#333", paddingBottom:"6px"}}>Agentic II</div>
        </div>
        <div style={{flex:1}}></div>
      </div>

      <div style={{padding:"40px", display:"flex", flexDirection: "row"}}>

        <div>
          <div>
          <button 
            style={{width:"300px", height:"40px"}}
            onClick={() => {
              props.promptQueue.addPromptRequest("Where is Berkeley?", (msg) => console.log("1 DONE", msg))
              props.promptQueue.addPromptRequest("What is the capital of France?", (msg) => console.log("2 DONE", msg))
              props.promptQueue.addPromptRequest("What is the capital of Switzerland?", (msg) => console.log("3 DONE", msg))
              props.promptQueue.addPromptRequest("What are tacos?", (msg) => console.log("4 DONE", msg))
              props.promptQueue.addPromptRequest("What is the capital of California", (msg) => console.log("5 DONE", msg))
            }}
          >Batch Test</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >How far is Berkeley from San Francisco</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Where is New York?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >How long does it take to get to My Coffee Roaster?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >How does traffic look today?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >What's the weather going to be like in Berkeley?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Should I bring a coat with me today?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Is it going to rain?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >How cold will it get this week?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Who is John Lennon?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Who is Barack Obama?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Who is Marlon Brando?</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >What wine goes well with fish</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >Do you like country music</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >I want to make tacos</button>
          </div>
          <div>
            <button 
              style={{width:"300px", height:"40px",}}
              onClick={routeInput}
            >What is a language model?</button>
          </div>
        </div>
      
        {/*<div style={{width:"350px", marginLeft:"20px"}}>
          CATEGORIES:<br/>
            a) The text is about location or travel directions.<br/>
            b) The text is about the weather.<br/>
            c) The text is about a person.<br/>
            d) The text is NOT location or travel directions and is NOT about the weather.<br/>
          </div>*/}
        
        <div style={{width:"300px", marginLeft:"20px"}}>
          <div style={{marginBottom:"20px"}}>
            {question}
          </div>
          <div style={{marginBottom:"20px"}}>
            {message}
          </div>
        </div>
        
      </div>

      <div style={{
        position:"fixed",
        right:"0px",
        width:"250px",
        height:"100%", 
        background:"#ddd"
      }}>
        Hello
      </div>

    </div>
  );
}

export default SimulationCanvas;
