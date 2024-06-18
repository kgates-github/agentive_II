import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import Overlay from './Overlay';
import { intentTests, categories, definitions } from './helpers';

class FunctionCallAgent {
  constructor(orchestrator, question, openAI) {
    this.orchestrator = orchestrator; // For callbacks
    this.question = question;
    this.openAI = openAI;
    this.function_call = "Wikipedia"

    this.functions = [
      {
        name: "Weather",
        description: "Get the location and timeframe, for a weather forecast",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The location for the weather forecast."
            },
            num_days: {
              type: "integer",
              description: "Give a timeframe based on the user input in days",
            },
          },
          required: ["location", "num_days",]
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
        description: "1) Get the appropriate wikipedia page URL that would contain the answer to the question.",
        parameters: {
          type: "object",
          properties: {
            wikipedia_page: {
              type: "string",
              description: "Wikipedia page URL"
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

  async getFunctionCall(updateContent) {
    updateContent(this.question);
    updateContent("Making function call...");
    
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
      const response = await this.openAI.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        functions: this.functions,
        function_call: "auto", 
      });
  
      const message = response.choices[0].message;
      
      if (message.function_call) {
        const functionName = message.function_call.name;
        const functionArgs = message.function_call.arguments; //JSON.parse(message.function_call.arguments);
        
        updateContent(functionArgs);
        if (functionName === "Weather") {
          new WeatherAgent(functionArgs)
        } else if (functionName === "Location") {
          new MapAgent(functionArgs)
        } else if (functionName === "Wikipedia") {
          new WikipediaAgent(functionArgs)
        }
      } else {
        updateContent(message.content);
        updateContent((
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <input type="text" placeholder="Enter some text" />
            
            <i className="material-icons" style={{color: "#999", fontSize:"24px"}}>arrow_circle_right</i>
           
          </div>
        ));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

class WeatherAgent {
  constructor(functionArgs) {
    //setContent([...content, functionArgs])
  }
}

class MapAgent {
  constructor(functionArgs) {
    //setContent([...content, functionArgs])
  }
}

class WikipediaAgent {
  constructor(functionArgs) {
    //setContent([...content, functionArgs])
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
    openAI,
  ) {
    this.promptQueue = promptQueue;
    this.setTestResults = setTestResults;
    this.setTestResultsByCategory = setTestResultsByCategory;
    this.testResultsRef = testResultsRef;
    this.categories = categories;
    this.definitions = definitions;
    this.agentClasses = agentClasses;
    this.openAI = openAI;
    this.count = 0;
  }

  getFunctionAgent(category, question) {
    if (category in this.agentClasses) {
      const agent = new FunctionCallAgent(this, question, this.openAI)
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
        letter = matches[0].toLowerCase();
        if (letter in this.categories) category = this.categories[letter];
      } 

      //const question = category == 'Weather' ? intentTest.question + " San Francisco, CA" : intentTest.question;
      const functionAgent = new FunctionCallAgent(this, intentTest.question, this.openAI);
      
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
        "agentClass": functionAgent ? functionAgent.getAgentClass() : "",
      }
  
      //setTestResults([...testResults, testResult]);
      const prevTestResults = this.testResultsRef.current
      this.setTestResults(prevTestResults => [...prevTestResults, testResult]);
    }

    this.promptQueue.addPromptRequest(prompt, callback) 
  }

  isPaused() {
    return this.promptQueue.isPaused;
  }

  pause() {
    this.promptQueue.pauseQueue();
  }

  unpause() {
    this.promptQueue.unpauseQueue();
  }

  batchTest() {
    this.unpause();
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

function TestWindow(props) {
  const [overlayState, setOverlayState] = useState("closed");
  const [overlayTestResultId, setOverlayTestResultId] = useState(null);
  //const [drawerTestResultId, setDrawerTestResultId] = useState(null);
  const [orchestratorAgent, setOrchestratorAgent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const testResultsRef = useRef(testResults);
  
  //const [drawerState, setDrawerState] = useState('closed');
  const [testResultsByCategory, setTestResultsByCategory] = useState(null)
  const [falsePositives, setFalsePositives] = useState(null)

  // Variants
  const variants = {
    dormant: {
      x: 0,
    },
    partial: {
      x: 938,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      x: 600,
      transition: { duration: 0.3, ease: 'easeInOut', }
    }
  }

  function openOverlay(id) {
    setOverlayState("partial")
  }

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
        props.openAI,
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
  }, [testResults]);
  
  
  return (
    <div style={{width:"100%", height:"100vh", background:"#fff", display:"flex", flexDirection:"column"}}>
      <div style={{height:"36px", background:"#fff", color:"#333", textAlign:"center", lineHeight:"36px"}}>
        Agentic II
      </div>

      {/* TABLE */}
      <div style={{width:"100%", flex:1, background:"#fff", 
        borderLeft:"1px solid #ccc", borderRight:"1px solid #ccc", 
        borderBottom:"1px solid #ccc", marginBottom:"12px",
        display:"flex", flexDirection:"column", overflow:"hidden"
      }}>
        {/* TABLE HEAD */}
        <div style={{
          width:"100%", height:"36px", display:"flex", flexDirection:"row",
          background:"#757575", paddingLeft:"4px"}}
        >
          <div style={{
            background:"#fff", marginTop:"6px", paddingLeft:"20px", paddingRight:"20px",
            fontWeight:"500", lineHeight:"30px", marginLeft:"6px",
            borderTopLeftRadius:"2px", borderTopRightRadius:"2px",
            textAlign:"center", color:"#333"}}>
            Test Batch One
          </div>
          <div style={{
            background:"#DCDCDC", marginTop:"6px", paddingLeft:"20px", paddingRight:"20px",
            fontWeight:"500", lineHeight:"30px", marginLeft:"6px",
            borderTopLeftRadius:"2px", borderTopRightRadius:"2px",
            textAlign:"center", color:"#333"}}>
            Test Batch Two
          </div>
          <div style={{paddingTop:"10px", paddingLeft:"4px"}}>
            <i className="material-icons" style={{color: "#fff", fontSize:"20px"}}>add</i> 
          </div>
          <div style={{"flex":1}}></div>
          <div className="tab-control" style={{marginLeft:"12px", marginRight:"12px", cursor:"pointer"}} onClick={() => setOverlayState("partial")}>
            <i className="material-icons" style={{color: "#ddd", fontSize:"24spx", lineHeight:"36px",}}>arrow_circle_left</i>  
          </div>

        </div>
        
        {/* TAB HEAD */}
        <div style={{
          width:"100%", height:"60px", display:"flex", flexDirection:"row",
          background:"#fff", paddingLeft:"0px", alignItems:"center",
          paddingLeft:"16px", background:"none",
        }}>
          <div className="test-control" 
            onClick={() => {
              orchestratorAgent.batchTest();
            }} style={{
            border:'1px solid #BEBEBE', width:"28px", height:"28px", 
            borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px", cursor:"pointer"}}>
            <i className="material-icons" style={{color: "#555", fontSize:"15px", lineHeight:"28px"}}>play_arrow</i> 
          </div>
          <div style={{
            border:'1px solid #BEBEBE', width:"28px", height:"28px", marginLeft:"8px",
            borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px"}}>
            <i className="material-icons" style={{color: "#555", fontSize:"16px", lineHeight:"28px"}}>restart_alt</i> 
          </div>
          <div style={{flex:1}}></div>
        </div>
        {/* TABLE */}
        
        <div style={{flex:1, overflowY:"scroll", background:"white"}}>
          <table className="testTable">
            <thead>
              <tr className="tr_header">
                <td>#</td>
                <td>Question</td>
                <td>Label</td>
                <td>LLM Guess</td>
                <td>Match</td>
                <td>False Positive</td>
                <td>Letter</td>
                <td>Duration</td>
                {/*<td>Message</td>*/}
                <td>Agent</td>
                <td>State</td>
              </tr>
            </thead>
            <tbody>
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
                      setOverlayState('partial')
                      setOverlayTestResultId(result.id);
                    } }
                    style={{cursor:"pointer"}}>
                    {result.question}
                  </div>
                </td>
                <td>{result.type}</td>
                <td>{result.category}</td>
                <td style={{textAlign:"center", paddingTop:"4px"}}>
                  {result.isMatch ?  
                    <i className="material-icons" style={{color: "#999", fontSize:"20px"}}>check</i> : 
                    <i className="material-icons" style={{color: "#E56D6D", fontSize:"20px" }}>error</i>
                  }
                </td>
                <td style={{textAlign:"center", paddingTop:"4px"}}>
                  {result.isFalsePositive ?  
                    <i className="material-icons" style={{color: "#E56D6D", fontSize:"20px" }}>error</i> : ""
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
      {/* END */}
      
      <Overlay 
        overlayState={overlayState} 
        setOverlayState={setOverlayState} 
        overlayTestResultId={overlayTestResultId}
        testResults={testResults}
      />

    </div>
  );
}

export default TestWindow;


{/* 
 
*/}