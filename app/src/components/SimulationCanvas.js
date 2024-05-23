import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import SimulationDrawer from './SimulationDrawer';
import { intentTests, categories, definitions } from './helpers';




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
      const matches = msg.match(/[a-dA-D]{1}(?=[\}\)])/g);
      let category = "None";
      let letter = "None"

      if (matches) {
        letter = matches[0];
        if (matches[0] in this.categories) category = this.categories[matches[0]];
      }
      const testResult = {
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
  const [drawerContent, setDrawerContent] = useState(null)
  
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

      <div style={{padding:"40px", display:"flex", flexDirection: "column"}}>
        <div>  
          <div>
            <button 
              style={{width:"300px", height:"40px"}}
              onClick={() => {
                console.log('orchestratorAgent', orchestratorAgent)
                orchestratorAgent.batchTest()
              }}
            >Run Test Batch</button>
          </div>
        </div>
        
        <div>
          <table className="testTable">
          <tbody>
            <tr className="tr_header">
              <td>Question</td>
              <td>Type</td>
              <td>LLM Guess</td>
              <td>Match</td>
              <td>Letter</td>
              <td>Duration</td>
              {/*<td>Message</td>*/}
              <td>Output</td>
            </tr>
            
            {testResults.map((result, index) => (
              <tr 
                key={'result_row_' + index}
                className="tr_data"
                onClick={() => setDrawerContent(result.question)}
              >
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
                  This is output (either chat text, or function call results)
                </td>
              </tr>
            ))}
            
            </tbody>
          </table>
        </div>
      </div>

      <SimulationDrawer 
        drawerContent={drawerContent}
      />

    </div>
  );
}

export default SimulationCanvas;
