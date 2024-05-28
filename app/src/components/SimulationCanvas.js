import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import SimulationDrawer from './SimulationDrawer';
import TestSummary from './TestSummary';
import axios from 'axios';
import { intentTests, categories, definitions } from './helpers';

class FunctionCallAgent {
  constructor(orchestrator, question, openAIRef) {
    this.orchestrator = orchestrator; // For callbacks
    this.question = question;
    this.openAIRef = openAIRef;

    this.functions = [
      {
        name: "Weather",
        description: "Get the current weather for a given location.",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The name of the city to get the weather for."
            }
          },
          required: ["location"]
        }
      },{
        name: "Location",
        description: "Get location info such as lat lon.",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Location information for a given location."
            }
          },
          required: ["information"]
        }
      },{
        name: "Wikipedia",
        description: "Get wikipedia page for a given question",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "Get wikipedia page for a given question."
            }
          },
          required: ["wikipedia_page"]
        }
      }
    ];
  }

  getAgentClass() {
    return(this.constructor.name);
  }

  async getFunctionCall() {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: this.question,
      }
    ];
    try {
      const response = await this.openAIRef.createChatCompletion({
        model: 'gpt-4',
        messages: messages,
        functions: this.functions,
        function_call: "auto", // Optionally specify which function to call
      });
  
      const message = response.data.choices[0].message;
      console.log(message)
      
      /*
      if (message.function_call) {
        const functionName = message.function_call.name;
        const functionArgs = JSON.parse(message.function_call.arguments);
        
        if (functionName === "Weather") {
          new WeatherAgent(functionArgs)
        } else if (functionName === "Location") {
          new MapAgent(functionArgs)
        } else if (functionName === "Wikipedia") {
          new WikipediaAgent(functionArgs)
        }
      } else {
        console.log(message.content);
      }*/
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

class WeatherAgent {
  constructor(functionArgs) {
    console.log(functionArgs);
  }
}

class MapAgent {
  constructor(functionArgs) {
    console.log(functionArgs);
  }
}
class WikipediaAgent {
  constructor(functionArgs) {
    console.log(functionArgs);
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
    openAIRef,
  ) {
    this.promptQueue = promptQueue;
    this.setTestResults = setTestResults;
    this.setTestResultsByCategory = setTestResultsByCategory;
    this.testResultsRef = testResultsRef;
    this.categories = categories;
    this.definitions = definitions;
    this.agentClasses = agentClasses;
    this.openAIRef = openAIRef;
    this.count = 0;
  }

  getFunctionAgent(category, question) {
    if (category in this.agentClasses) {
      const agent = new FunctionCallAgent(this, question, this.openAIRef)
      return agent;
    }
    return null;
  }
  
  routeInput(intentTest) {
    const prompt = `# First, read the following text: ${intentTest.question}
    
    # Next, read through all of these categories: ${definitions}
    
    # After that, determine which category describes the text and list the letter. Put the letter in JSON line this {a}. Limit you answer to 15 words or less.`

    const callback = (msg, start_time) => {
      let category = "None";
      let letter = "None";
      let matches = msg.match(/[a-eA-E]{1}(?=[\}\)"])/g);

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
        "isFalsePositive": category != intentTest.type && category != "None",
        "letter": letter,
        "duration": Date.now() - start_time,
        "prompt": prompt,
        "message": msg,
        "functionAgent": functionAgent,
        "agentClass": functionAgent ? functionAgent.getAgentClass(intentTest.question) : "",
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
  const [falsePositives, setFalsePositives] = useState(null)
  
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
        props.openAIRef,
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
  
      setTestResultsByCategory(categoryResults);

      const falsePositiveResults = testResults.filter((result) => result.isFalsePositive);
      
      const falsePositivesByCategory = falsePositiveResults.reduce((acc, testResult) => {
        const { category } = testResult;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(testResult);
        return acc;
      }, {});

      setFalsePositives(falsePositivesByCategory);
      
    }
    console.log(falsePositives)
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

          <div style={{width:"1px", height:"60px", background:"#ccc", marginLeft:"32px", marginRight:"32px"}}></div>

          <div style={{width:"200px", alignItems:"center"}}>
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

          <div style={{width:"1px", height:"60px", background:"#ccc", marginLeft:"32px", marginRight:"8px"}}></div>

          <div style={{display:"flex", flexDirection:"row", height:"80px", background:"none",}}>
            <TestSummary category={'All Categories'} testResults={testResults}/>
            {
              testResultsByCategory && (
                Object.keys(testResultsByCategory).map((category, index) => (
                  <TestSummary key={"TS_"+index} category={category} testResults={testResultsByCategory[category]} />
                ))
              )
            }
          </div>

          <div style={{width:"1px", height:"60px", background:"#ccc", marginLeft:"32px", marginRight:"32px"}}></div>

          <div style={{display:"flex", flexDirection:"column", fontSize:"12px", lineHeight:"14px"}}>
          {
            falsePositives && (
              Object.keys(falsePositives).map((category, index) => (
                <div style={{display:"flex", flexDirection:"row"}}>
                  <div style={{width:"60px"}}>{`${category}`} : </div>
                  <div style={{fontWeight:"600"}}>{`${falsePositives[category].length}`}</div>
                </div>
              ))
            )
          }
          </div>

          

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
              <td>False Positive</td>
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
                <td style={{textAlign:"center", paddingTop:"4px"}}>
                  {result.isFalsePositive ?  
                    <i className="material-icons" style={{color: "#E56D6D" }}>error</i> : ""
                    
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
