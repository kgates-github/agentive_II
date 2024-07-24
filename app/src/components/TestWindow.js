import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import Overlay from './Overlay';
import TestSummary from './TestSummary';
import { intentTests, categories, definitions } from './helpers';
import { motion } from "framer-motion"
import axios from 'axios';

class FunctionCallAgent {
  constructor(orchestrator, question, openAI) {
    this.orchestrator = orchestrator; // For callbacks
    this.question = question;
    this.openAI = openAI;
    this.function_call = "Wikipedia";

    this.functions = [
      {
        name: "Weather",
        description: "Get the location and timeframe for a weather forecast",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city for the weather forecast."
            },
            state: {
              type: "string",
              description: "The state for the weather forecast."
            },
            num_days: {
              type: "integer",
              description: "Give a timeframe based on the user input in days",
            },
          },
          required: ["city", "state", "num_days",]
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

  async getFunctionCall(updateContent, promptQueue) {
    updateContent({message:this.question, type:"user"});
    updateContent({message:"Making function call...", type:"system"});
    
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: "I'll be in San Francisco tomorrow",
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
        
        if (functionName === "Weather") {
          new WeatherAgent(functionArgs, updateContent, promptQueue, this.question)
        } else if (functionName === "Location") {
          new MapAgent(functionArgs, updateContent, promptQueue, this.question)
        } else if (functionName === "Wikipedia") {
          new WikipediaAgent(functionArgs, updateContent, promptQueue, this.question)
        }
      } else {
        updateContent({message: message.content, type:"chat bot"});
        updateContent({message: (
          <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
            <input type="text" placeholder="Enter some text" />
            <i className="material-icons" style={{color: "#999", fontSize:"24px"}}>
              arrow_circle_right
            </i>
          </div>
        ), type:"chat bot"});
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

class WeatherAgent {
  constructor(functionArgs, updateContent, promptQueue, question) {
    const cors = 'https://cors-anywhere.herokuapp.com/'

    updateContent({message: "Function type: Weather", type:"system"})
    const argsJSON = JSON.parse(functionArgs)
    console.log("argsJSON", argsJSON)

    const getWeather = async (argsJSON) => {
      const city = argsJSON["city"].replace(" ", "+")
      const state = argsJSON["state"].replace(" ", "+")
      const weatherAPIKey = process.env.REACT_APP_WEATHER_KEY
      
      // Get lat lon
      const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${weatherAPIKey}`
      let geoResponse = await fetch(geoURL)
      let geoData = await geoResponse.json()
      const lat = geoData[0].lat
      const lon = geoData[0].lon
      updateContent({message: `Lat: ${lat} Lon ${lon}`, type:"system"})

       // Get grid
      const reponseEndPoint = await axios({
        method: 'get',
        url:  `https://api.weather.gov/points/${lat},${lon}`,
        withCredentials: false,
      })
      updateContent({message: "reponseEndPoint: " + reponseEndPoint.data.properties.forecast, type:"system"});

      const reponseForecast = await axios({
        method: 'get',
        url:  reponseEndPoint.data.properties.forecast,
        withCredentials: false,
      })
      const forecast = reponseForecast.data.properties.periods[argsJSON.num_days * 2]
      updateContent({
        message: `detailedForecast for ${forecast.name}: ${forecast.detailedForecast}`, 
        type:"system"
      })

      const promptAnswer = `
        Using this weather report: "${forecast.detailedForecast}", 
        Come up with a short response to this: "${question}".`

      const callback = (msg, timestamp) => {
        let str = msg.replace(/^[^:]*:/, '').trim();
        str = str.replace(/"/g, '');
        updateContent({message: str, type:"chat bot"})
      }
      updateContent({message: "Prompt: " + promptAnswer, type:"system"});
      promptQueue.addPromptRequest(promptAnswer, callback)
    }

    getWeather(argsJSON);
  }
}

class MapAgent {
  constructor(functionArgs) {
    //setContent([...content, functionArgs])
  }
}

class WikipediaAgent {
  constructor(functionArgs, updateContent, promptQueue, question) {
    updateContent({message: "Function type: Wikipedia", type:"system"})
    const argsJSON = JSON.parse(functionArgs)
    const wikiPage = argsJSON["wikipedia_page"]
    updateContent({message: (<a href={`https://en.wikipedia.org/wiki/${wikiPage}`} target="blank">{wikiPage}</a>), type:"system"})

    const fetchSummary = async() => {
      try {
        updateContent({message: "Fetching wikipedia summary: " + wikiPage, type:"system"})
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
        );

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        const prompt = `Given this wikipedia page: "${data.extract}" 
        Provide a short, appropriate response to this: "${question}".`
        updateContent({message: "Prompt: " + prompt, type:"system"});

        const callback = (msg, timestamp) => {
          const str = msg.replace(/^[^:]*:/, '').trim();
          updateContent({message: str, type:"chat bot"})
        }
        promptQueue.addPromptRequest(prompt, callback) 
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchSummary()
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
  const [orchestratorAgent, setOrchestratorAgent] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const testResultsRef = useRef(testResults);
  const [testResultsByCategory, setTestResultsByCategory] = useState(null)
  const [falsePositives, setFalsePositives] = useState(null)
  const [analyticsIsOpen, setAnalyticsIsOpen] = useState(false)

  // Variants
  const variants = {
    closed: {
      width: "0px",
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    open: {
      width: "240px",
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
  }

  function toggleAnalytics() {
    setAnalyticsIsOpen(!analyticsIsOpen);
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
          background:"#6e6e6e", paddingLeft:"4px"}}
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
            <i className="material-icons" style={{color: "#eee", fontSize:"24spx", lineHeight:"36px",}}>arrow_circle_left</i>  
          </div>

        </div>
        
        {/* TAB HEAD */}
        <div style={{
          width:"100%", height:"80px", display:"flex", flexDirection:"row",
          background:"#fff", paddingTop:"16px", paddingBottom:"16px", alignItems:"center",
          paddingLeft:"16px", background:"none",
        }}>

          <div className="select-container">
            <select className="nice-select">
              <option value="option1">Intent tests one</option>
              <option value="option2">Intent tests two</option>
            </select>
          </div>
          <div className="select-container">
            <select className="nice-select">
              <option value="option1">Gemma-2b</option>
              <option value="option2">Some-other-llm</option>
            </select>
          </div>

          <div className="test-control" 
            onClick={() => {
              orchestratorAgent.batchTest();
              //setAnalyticsIsOpen(true);
            }} style={{
            border:'1px solid #777', width:"28px", height:"28px", 
            borderRadius:"5px", background:"#777", textAlign:"center", lineHeight:"28px", cursor:"pointer"}}>
            <i className="material-icons" style={{color: "#fff", fontSize:"15px", lineHeight:"28px"}}>play_arrow</i> 
          </div>
          <div className="test-control" style={{
            border:'1px solid #BEBEBE', width:"28px", height:"28px", marginLeft:"8px",
            borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px", cursor:"pointer"}}>
            <i className="material-icons" style={{color: "#555", fontSize:"16px", lineHeight:"28px"}}>restart_alt</i> 
          </div>

          <div style={{
            width:"280px", marginLeft:"80px", marginRight:"8px" }}>
            <input type="text" placeholder="Add a test question" style={{
              width: "100%", height:"28px", borderRadius:"5px", paddingLeft:"8px",
              border:"1px solid #BEBEBE", color: "#555",
              }} />
          </div>

          <div className="test-control" style={{
            border:'1px solid #BEBEBE', width:"28px", height:"28px", marginLeft:"14px",
            borderRadius:"5px", background:"#F5F5F5", textAlign:"center", lineHeight:"28px", cursor:"pointer"}}>
            <i className="material-icons" style={{color: "#555", fontSize:"16px", lineHeight:"28px"}}>add</i> 
          </div>

          <div style={{flex:1}}></div>
          
          <div onClick={() => toggleAnalytics()} style={{marginRight:"26px", cursor:"pointer"}}>
            <i className="material-icons" style={{color: "#555", fontSize:"20px", lineHeight:"28px", width:"20px"}}>
              bar_chart_4_bars
            </i> 
          </div>
        </div>


        {/* TABLE */}

        <div style={{flex:1, overflow:"none", background:"none", display:"flex", flexDirection:"row"}}>
          <div style={{flex:1, overflowY:"scroll", background:"none", height:"100vh"}}>
            <table className="testTable" style={{paddingBottom:"220px"}}>
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

          <motion.div 
          animate={analyticsIsOpen ? 'open' : 'closed'}
          variants={variants}
          initial="open"
          style={{
            width:"240px", 
            background:"#555", 
            overflow:"hidden",
            marginTop:"2px", 
            height:"100vh", 
            display:"flex", 
            flexDirection:"column"}}>
            <div style={{display:"flex", flexDirection:"row", overflow:"hidden", width:"240px"}}>
              <div style={{
                background:"#6e6e6e", color:"#fff", height:"32px", 
                width:"224px", 
                marginTop:"0px", lineHeight:"32px", paddingLeft:"12px",}}>
                Analytics
              </div>
              <div onClick={() => toggleAnalytics()} 
                style={{width:"20px", paddingRight:"12px", background:"#6e6e6e", height:"32px", marginTop:"0px", cursor:"pointer"}}>
                <i className="material-icons" style={{color: "#fff", fontSize:"16px", lineHeight:"32px"}}>close</i> 
              </div>
            </div>
           
            <div style={{padding:"12px"}}>
              {/* CHARTS */}
              <div style={{paddingTop:"12px", color:"#ddd", fontWeight:300}}>COMPLETION</div>
              <div style={{width:"200px", alignItems:"center", marginTop:"10px"}}>
                <div style={{color:"#fff", position:"relative", bottom:"-3px", fontSize:"12px"}}>
                  Intent Tests One
                </div>
                <div style={{width:"200px", height:"4px", background:"#444", marginTop:"6px", marginBottom:"2px"}}>
                  <div style={{
                    width: testResults.length > 0 ? Math.round((testResults.length / intentTests.length)*200) +"px" : 0+"px",
                    height:"4px", 
                    background:"#aaa",}}></div>
                </div>
                <div style={{color:"#fff", fontSize:"12px"}}>
                  {intentTests.length} of {testResults.length}
                </div>
              </div>
              <div style={{paddingTop:"20px", color:"#ddd", fontWeight:300}}>MATCHES</div>
              <div style={{display:"flex", flexDirection:"column", background:"none",}}>
                <TestSummary category={'All Categories'} testResults={testResults}/>
                {
                  testResultsByCategory && (
                    Object.keys(testResultsByCategory).map((category, index) => (
                      <TestSummary key={"TS_"+index} category={category} testResults={testResultsByCategory[category]} />
                    ))
                  )
                }
              </div>


            </div>
          </motion.div>
          
        </div>
      </div>
      {/* END */}
      
      <Overlay 
        overlayState={overlayState} 
        setOverlayState={setOverlayState} 
        overlayTestResultId={overlayTestResultId}
        testResults={testResults}
        promptQueue={props.promptQueue}
      />

    </div>
  );
}

export default TestWindow;


{/* 
 
*/}