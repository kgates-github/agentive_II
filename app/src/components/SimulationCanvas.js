import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import SimulationDrawer from './SimulationDrawer';
import TestSummary from './TestSummary';
import { intentTests, categories, definitions } from './helpers';
import { v4 as uuidv4 } from 'uuid';

class FunctionCallAgent {
  constructor() {
    // Set up properties to connect to GPT
  }

  getFunctionCall(prompt) {
    // This calls GPT function call
  }
}

class WeatherAgent extends FunctionCallAgent {
  constructor() {
    super();
  }
}

class OrchestratorAgent {
  constructor(
    promptQueue, 
    setTestResults, 
    testResultsRef,
    categories, 
    definitions,
  ) {
    this.promptQueue = promptQueue;
    this.setTestResults = setTestResults;
    this.testResultsRef = testResultsRef;
    this.categories = categories;
    this.definitions = definitions;
  }
  
  routeInput(intentTest) {
    const prompt = `First, read the following text: ${intentTest.question}
    
    Next, read through all of the categories found below. After that, list the letter of the category that best describes the text. Put the letter in JSON line this {a}. Make sure your answer is no more than 10 words.
    
    CATEGORIES:
    ${definitions}`

    const callback = (msg, start_time) => {
      const matches = msg.match(/[a-eA-E]{1}(?=[\}\)])/g);
      let category = "None";
      let letter = "None"

      if (matches) {
        letter = matches[0];
        if (matches[0] in this.categories) category = this.categories[matches[0]];
      }
      const testResult = {
        "id": uuidv4(),
        "question": intentTest.question,
        "type": intentTest.type,
        "category": category,
        "isMatch": category == intentTest.type,
        "letter": letter,
        "duration": Date.now() - start_time,
        "message": msg,
      }
  
      //setTestResults([...testResults, testResult]);
      const prevTestResults = this.testResultsRef.current
      this.setTestResults(prevTestResults => [...prevTestResults, testResult]);
    }

    this.promptQueue.addPromptRequest(prompt, callback) 
  }

  batchTest() {
    this.promptQueue.clearQueue();
    this.setTestResults([]);

    for (let i = 0; i < intentTests.length; i++) {
      this.routeInput(intentTests[i])
    }
  }
}

function SimulationCanvas(props) {
  const [orchestratorAgent, setOrchestratorAgent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const testResultsRef = useRef(testResults);
  const [drawerContentId, setDrawerContentId] = useState(null)
  const [numMatches, setNumMatches] = useState(0)
  const [testResultsByCategory, setTestResultsByCategory] = useState(null)

  
  useEffect(() => {  
    setOrchestratorAgent(
      new OrchestratorAgent(
        props.promptQueue,
        setTestResults,
        testResultsRef,
        categories, 
        definitions,
      )
    );
  }, []);

  useEffect(() => {  
    if (testResults.length) {
      const matches = testResults.filter((testResult) => testResult.isMatch)
      setNumMatches(matches.length);

      const categoryResults = testResults.reduce((acc, testResult) => {
        const { type } = testResult;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(testResult);
        return acc;
      }, {});
  
      setTestResultsByCategory(categoryResults)
    }
  }, [testResults]);
  

  return (
    <div style={{
      background:"#fff",
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

      <div style={{padding:"20px", display:"flex", flexDirection: "column"}}>
        <div style={{
          display:"flex", 
          flexDirection:"row", 
          alignItems:"center", 
          marginBottom:"12px",
        }}>  
          <div>
            <div 
              style={{  
                marginLeft:"32px", 
                marginRight:"32px",  
                paddingRight:"32px",           
                borderRight:"1px solid #999",
                cursor:"pointer",
                display:"flex",
                flexDirection:"row",
                justifyContent:"space-evenly",
                alignItems:"center",
              }}
            >
              <div onClick={() => {orchestratorAgent.batchTest()}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"40px" }}>play_circle</i> 
                </div>
                <div style={{color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Start</div>
                
              </div>
              <div onClick={() => {orchestratorAgent.batchTest()}} style={{marginLeft:"32px"}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"40px" }}>replay</i> 
                </div>
                <div style={{color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Reset</div> 
              </div>
            
            </div>
          </div>
          
          <TestSummary category={'All Categories'} testResults={testResults}/>
          
          {
            testResultsByCategory && (
              Object.keys(testResultsByCategory).map((category, index) => (
                <TestSummary key={index} category={category} testResults={testResultsByCategory[category]} />
              ))
            )
          }

        </div>
        
        <div>
          <table className="testTable">
          <tbody>
            <tr className="tr_header">
              <td>#</td>
              <td>Question</td>
              <td>Type</td>
              <td>LLM Guess</td>
              <td>Match</td>
              <td>Letter</td>
              <td>Duration</td>
              {/*<td>Message</td>*/}
              <td>State</td>
            </tr>
            
            {testResults.map((result, index) => (
              <tr 
                key={'result_row_' + index}
                id={result.id}
                className="tr_data"
                onClick={() => setDrawerContentId(result.id)}
              >
                <td>{index + 1}</td>
                <td>{result.question}</td>
                <td>{result.type}</td>
                <td>{result.category}</td>
                <td style={{textAlign:"center"}}>
                  {result.isMatch ?  
                    <i className="material-icons" style={{color: "#37A169" }}>check</i> : 
                    <i className="material-icons" style={{color: "#E56D6D" }}>error</i>
                  }
                </td>
                <td>{result.letter}</td>
                <td>{result.duration}</td>
                {/*<td>{result.message}</td>*/}
                <td>
                  Making function call...
                </td>
              </tr>
            ))}
            
            </tbody>
          </table>
        </div>
      </div>

      <SimulationDrawer 
        drawerContentId={drawerContentId}
      />

    </div>
  );
}

export default SimulationCanvas;
