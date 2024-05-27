import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import SimulationDrawer from './SimulationDrawer';
import TestSummary from './TestSummary';
import axios from 'axios';
import { intentTests, categories, definitions } from './helpers';


class FunctionCallAgent {
  constructor() {
    // Set up properties to connect to GPT
  }

  async getFunctionCall(question) {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: question,
        max_tokens: 60
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_KEY`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error(error);
    }
  }
}

class WeatherAgent extends FunctionCallAgent {
  constructor() {
    super();
  }

  getAgentClass() {
    return(this.constructor.name);
  }

  getFunctionCall(question) {
    return super.getFunctionCall(question);
  }
}

class MapAgent extends FunctionCallAgent {
  constructor() {
    super();
  }

  getAgentClass() {
    return(this.constructor.name);
  }
}

class WikipediaAgent extends FunctionCallAgent {
  constructor() {
    super();
  }

  getAgentClass() {
    return(this.constructor.name);
  }
}

class OrchestratorAgent {
  constructor(
    promptQueue, 
    setTestResults, 
    setTestResultsByCategory,
    testResultsRef,
    categories, 
    definitions,
    agentClasses,
  ) {
    this.promptQueue = promptQueue;
    this.setTestResults = setTestResults;
    this.setTestResultsByCategory = setTestResultsByCategory;
    this.testResultsRef = testResultsRef;
    this.categories = categories;
    this.definitions = definitions;
    this.agentClasses = agentClasses;
    this.count = 0;
  }

  getFunctionAgent(category) {
    if (category in this.agentClasses) {
      const agent = new this.agentClasses[category](this);
      return agent;
    }
    return null;
  }
  
  routeInput(intentTest) {
    const prompt = `First, read the following text: ${intentTest.question}
    
    Next, read through all of the categories found below. After that, list the letter of the category that best describes the text. Put the letter in JSON line this {a}. Make sure your answer is no more than 10 words.
    
    CATEGORIES:
    ${definitions}`

    const callback = (msg, start_time) => {
      let category = "None";
      let letter = "None";
      let matches = msg.match(/[a-eA-E]{1}(?=[\}\)])/g);

      if (!matches) matches = msg.match(/[bcdBCD]{1}(?=[\s])/g);
      if (matches) {
        letter = matches[0];
        if (matches[0] in this.categories) category = this.categories[matches[0]];
      } 
      const functionAgent = this.getFunctionAgent(category)
      const testResult = {
        "id": "test_result_" + this.count++,
        "question": intentTest.question,
        "type": intentTest.type,
        "category": category,
        "isMatch": category == intentTest.type,
        "letter": letter,
        "duration": Date.now() - start_time,
        "prompt": prompt,
        "message": msg,
        "functionAgent": functionAgent,
        "agentClass": functionAgent ? functionAgent.getAgentClass() : "",
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
    this.setTestResultsByCategory(null);

    for (let i = 0; i < intentTests.length; i++) {
      this.routeInput(intentTests[i])
    }
  }
}

const agentClasses = {
  "Location": MapAgent,
  "Weather": WeatherAgent,
  "People": WikipediaAgent
}

function SimulationCanvas(props) {
  const [orchestratorAgent, setOrchestratorAgent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const testResultsRef = useRef(testResults);
  const [drawerTestResultId, setDrawerTestResultId] = useState(null);
  const [drawerState, setDrawerState] = useState('closed');
  const [testResultsByCategory, setTestResultsByCategory] = useState(null)
  
  useEffect(() => {  
    setOrchestratorAgent(
      new OrchestratorAgent(
        props.promptQueue,
        setTestResults,
        setTestResultsByCategory,
        testResultsRef,
        categories, 
        definitions,
        agentClasses,
      )
    );
  }, []);

  useEffect(() => {  
    if (testResults.length) {
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
      <div className="header" style={{background:"none", marginBottom:"40px", zIndex:"0"}}>
        <div style={{flex:1}}></div>
        <div className="title">
          <div className="header-06" style={{color:"#333", paddingBottom:"6px"}}>Agentic II</div>
        </div>
        <div style={{flex:1}}></div>
      </div>
      <div style={{padding:"12px", display:"flex", flexDirection: "column"}}>
        <div style={{
          display:"flex", 
          flexDirection:"row", 
          alignItems:"center", 
          marginBottom:"12px",
        }}>  
          <div>
            <div 
              style={{  
                marginLeft:"36px", 
                marginRight:"28px",  
                paddingRight:"36px",           
                borderRight:"1px solid #ccc",
                cursor:"pointer",
                display:"flex",
                flexDirection:"row",
                justifyContent:"space-evenly",
                alignItems:"center",
              }}
            >
              <div onClick={() => {orchestratorAgent.batchTest()}} style={{marginTop:"12px",}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>play_circle</i> 
                </div>
                <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Start</div>
              </div>
              <div onClick={() => {orchestratorAgent.batchTest()}} style={{marginLeft:"20px",marginTop:"12px",}}>
                <div>
                  <i className="material-icons" style={{color: "#777", fontSize:"36px" }}>replay</i> 
                </div>
                <div style={{marginTop:"-5px", color:"#444", fontSize:"12px", width:"40px", textAlign:"center"}}>Reset</div> 
              </div>
            </div>
          </div>

          <div style={{width:"200px", paddingRight:"32px", marginRight:"12px", borderRight:"1px solid #ccc",}}>
            <div style={{color:"#444", position:"relative", bottom:"-3px", fontSize:"12px"}}>
              % Test Batch Completed
            </div>
            <div style={{width:"200px", height:"8px", background:"#ddd", marginTop:"6px", marginBottom:"2px"}}>
              <div style={{
                width: testResults.length > 0 ? Math.round((testResults.length / intentTests.length)*200) +"px" : 0+"px",
                height:"8px", 
                background:"#aaa",}}></div>
            </div>
            <div style={{color:"#444", fontSize:"12px"}}>
              {intentTests.length} of {testResults.length}
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
              <td>Agent</td>
              <td>State</td>
            </tr>
            
            {testResults.map((result, index) => (
              <tr 
                key={'result_row_' + index}
                id={result.id}
                className="tr_data"
              >
                <td>{index + 1}</td>
                <td className="openDrawerTd">
                  <div 
                    className="openDrawerLink"
                    onClick={() => {
                      setDrawerState('partial')
                      setDrawerTestResultId(result.id);
                    } }
                    style={{cursor:"pointer"}}>
                    {result.question}
                  </div>
                </td>
                <td>{result.type}</td>
                <td>{result.category}</td>
                <td style={{textAlign:"center", paddingTop:"4px"}}>
                  {result.isMatch ?  
                    <i className="material-icons" style={{color: "#999" }}>check</i> : 
                    <i className="material-icons" style={{color: "#E56D6D" }}>error</i>
                  }
                </td>
                <td>{result.letter}</td>
                <td>{result.duration}</td>
                {/*<td>{result.message}</td>*/}
                <td>
                  <div 
                    style={{textDecoration:"none"}}>
                    {result.functionAgent ? result.functionAgent.getAgentClass() : ""}
                  </div>
                </td>
                <td>-</td>
              </tr>
            ))}
            
            </tbody>
          </table>
        </div>
      </div>

      <SimulationDrawer 
        drawerTestResultId={drawerTestResultId}
        drawerState={drawerState}
        setDrawerState={setDrawerState}
        testResults={testResults}
      />

    </div>
  );
}

export default SimulationCanvas;
