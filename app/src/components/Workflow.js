import React, { useState, useEffect } from 'react';
import CardInput from './CardInput';
import CardOutput from './CardOutput';
import '../App.css';
import '../Workflow.css';

/*
const axios = require('axios');
const apiKey = process.env.OPENAI_API_KEY;
const client = axios.create({
    headers: { 'Authorization': 'Bearer ' + apiKey }
});

const params = {
  "prompt": "Once upon a time", 
  "max_tokens": 10
}

client.post('https://api.openai.com/v1/engines/davinci/completions', params)
  .then(result => {
    console.log(params.prompt + result.data.choices[0].text);
}).catch(err => {
  console.log(err);
});
*/

function Workflow(props) {
  const [llmIsProcessing, setLlmIsProcessing] = useState(false);
  const [chatDialog, setChatDialog] = useState([]);
  const [chatPrompts, setChatPrompts] = useState("");
  const [message, setMessage] = useState(null);

  /****************************************
    LLM Inference
  *****************************************/
  let partialMessage = "";

  const displayPartialResults = (
    partialResults, 
    complete, 
  ) => {
    partialMessage += partialResults
    setMessage(partialMessage);
    //messageDivRef.current.innerHTML = partialMessage;
  
    if (complete) {
      setLlmIsProcessing(false);
      setMessage(null);
    }
  }

  function promptLLM(llmInference, userInput, chatPrompts) {
    partialMessage = ""; 
    let prompt = "";

    // If our prompt gets too long, reset it
    if (chatPrompts.length < 1000) {
      prompt += chatPrompts;
    } else {
      setChatPrompts("");
    }
    prompt += `<start_of_turn>user
      ${userInput}<end_of_turn>
      <start_of_turn>model`

    console.log('Prompt.length: ', prompt.length);

    setChatPrompts(prompt);
    setChatDialog([...chatDialog, {speaker: 'user', message: userInput}]);

    if (!llmIsProcessing) {
      try {
        setLlmIsProcessing(true);
        llmInference.generateResponse(
          prompt, 
          (partialResults, complete) => displayPartialResults(partialResults, complete)
        );
      } catch (error) {
        console.log('Error generating response: ', error);
      }
    }
  }
  
  useEffect(() => {   
    console.log('props.llmInference: ', props.llmInference);
  }, [props.llmInference]);

  return (
    <div style={{
      marginTop:"20px", 
      marginBottom:"200px",
      display:"flex",
      justifyContent:"center",
      flexDirection:"row",
      gap:"20px",
    }}>
      <div style={{display:"flex", flexDirection:"column"}}>
        <div className="card-container">
          <p style={{fontWeight:"600"}}>User Input</p>
          <textarea id="userPrompt" style={{  
            width:"600px",
            height:"40px",
            border:"1px solid #ddd", 
            fontFamily:"Source Code Pro !important", 
            borderRadius:"2px", 
            fontSize:"14px", 
            whiteSpace: "pre-wrap",
            marginBottom:"12px",
          }}
          value={''}>
          </textarea>
          <button onClick={() => {alert('Run')}}>Run</button>
        </div>

        <div className="card-container">
          <p style={{fontWeight:"600"}}>Eval Prompt:</p>
          <textarea d="evalPrompt" style={{  
            width:"600px",
            height:"300px",
            border:"1px solid #ddd", 
            fontFamily:"Source Code Pro !important", 
            borderRadius:"2px", 
            fontSize:"14px", 
            whiteSpace: "pre-wrap",
            marginBottom:"12px",
          }}
          value={`First, read the following text: 

Can you get me directions from Berkeley to Sacramento

Next, read through all of the categories found below and list the letter of the category that best describes the text. If there is not a good fit, list d.

CATEGORIES:
a) The text is about location or travel directions.
b) The text is about the weather.
c) The text is about a person.
d) The text is NOT location or travel directions and is NOT about the weather.
          `}>
          </textarea>
          <button onClick={() => {alert('Run')}}>Run</button>
        </div>

        <div className="card-container">
          <p style={{fontWeight:"600",}}>Eval Output:</p>
          <div id="evalOutput" style={{  
            width:"600px",
            height:"40px",
            fontFamily:"Source Code Pro !important", 
            background:"whitenone",
            borderRadius:"2px", 
            fontSize:"14px", 
            whiteSpace: "pre-wrap"
          }}>
            The answer is a) The text is about location or travel directions.
          </div>
        </div>
        
        <div className="card-container">
          <p style={{fontWeight:"600",}}>OpenAI API Call:</p>
          <div style={{  
            width:"600px",
            height:"100px",
            fontFamily:"Source Code Pro !important" , 
            background:"none",
            borderRadius:"2px", 
            fontSize:"16px", 
            whiteSpace: "pre-wrap"
          }}>
            {`
              messages = {
                "role": "user", 
                "content": "What's the weather like in San Francisco, Tokyo, and Paris?"
              }
            `}
              
          </div>
        </div>
      </div>
      
      {/* Workflow Output */}
      <div style={{display:"flex", flexDirection:"column"}}>
        
        <div className="card-container">
          <p style={{fontWeight:"600"}}>Logs</p>
          <textarea id="chatDialog" style={{  
            width:"600px",
            minHeight:"800px",
            border:"1px solid #ddd", 
            fontFamily:"Source Code Pro !important", 
            borderRadius:"2px", 
            fontSize:"14px", 
            whiteSpace: "pre-wrap",
            marginBottom:"12px",
          }}></textarea>
        </div>
      </div>
      
    </div>
  );
}

export default Workflow;

{/*
  Simple query: "How hot will it get tomorrow in Berkeley"
  Test if query id function call
  
  If yes:
  Call function
  Get function response and summarize
  Add to chat dialog
  Add to chat prompts

  If no, call promptLLM


  <div className="grid-container" style={{}}>
    <div className="grid-item"><CardInput /></div>
    <div className="grid-item"><CardInput /></div>
    <div className="grid-item"><CardOutput /></div>
    <div className="grid-item"><CardInput /></div>
    <div className="grid-item"><CardOutput /></div>
    <div className="grid-item"><CardOutput /></div>
    <div className="grid-item"><CardInput /></div>

    <div className="grid-item"></div>
    <div className="grid-item"></div>
    <div className="grid-item"><CardOutput /></div>
    <div className="grid-item"><CardInput /></div>
    <div className="grid-item"><CardOutput /></div>
    <div className="grid-item"></div>
    <div className="grid-item"><CardOutput /></div>
  </div>
*/}