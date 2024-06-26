
import { useEffect, useState, useRef } from 'react';  
import getLlmInference from './components/llm_inference';
//import SimulationCanvas from './components/SimulationCanvas';
import TestWindow from './components/TestWindow';
import { OpenAI } from 'openai';
import './App.css';


class PromptQueue {
  constructor(llmInference) {
    this.llmInference = llmInference;
    this.queue = [];
    this.isRunning = false;
    this.isPaused = false;
  }

  clearQueue() {
    this.queue = [];
  }

  pauseQueue() {
    this.isPaused = true;
  }

  unpauseQueue() {
    this.isPaused = false;
    this.processQueue();
  }

  addPromptRequest(prompt, callback) {
    this.queue.push(
      {
        prompt: prompt,
        callback: callback,
        message: '',
        start_time: null,
      }
    );
    this.processQueue();
  }

  getResults(partialResults, complete, promptRequest, self) {
    promptRequest.message += partialResults;

    // If we have a streaming callback function, send partial results
    if ('streamingCallback' in promptRequest) {
      promptRequest.streamingCallback(partialResults);
    }

    if (complete) {
      promptRequest.callback(promptRequest.message, promptRequest.start_time);
      self.isRunning = false;

      // Timeout to lesses chance of overlap
      setTimeout(() => {
        self.processQueue();
      }, 150);
    }
  }

  processQueue() {
    if (!this.isRunning && this.queue.length > 0 && !this.isPaused) {
      this.isRunning = true;
      const promptRequest = this.queue.shift();
      promptRequest['start_time'] = Date.now();

      const results = this.getResults
      this.llmInference.generateResponse(
        promptRequest.prompt, 
        (partialResults, complete) => results(partialResults, complete, promptRequest, this)
      );
    }
  }
}

function App() {
  const userAgent = navigator.userAgent;
  const [isLoaded, setIsLoaded] = useState(false);
  const [llmInference, setLlmInference] = useState(null);
  const [promptQueue, setPromptQueue] = useState(null);
  const [openAI, setOpenAI] = useState(null);

  useEffect(() => {  
    if (promptQueue != null) {
      setIsLoaded(true);
    }
  }, [promptQueue]);

  useEffect(() => {  
    if (llmInference != null) {
      setPromptQueue(new PromptQueue(llmInference));
    }
  }, [llmInference]);

  useEffect(() => { 
    getLlmInference().then(result => {
      setLlmInference(result);
    }).catch(error => {
      console.log(error)
    });

    const openaiApiKey = process.env.REACT_APP_OPENAI_KEY

    if (!openaiApiKey) {
      console.log('process.env.REACT_APP_OPENAI_KEY', process.env)
    } else {
      const test = new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true })
      setOpenAI(new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true }));
    }
  }, []);


  return (
    userAgent.indexOf("Chrome") > -1 ? 
    (
      <>
        
        {isLoaded ? <TestWindow promptQueue={promptQueue} openAI={openAI}/> : null}
        {/*isLoaded ? <SimulationCanvas promptQueue={promptQueue} openAI={openAI}/> : null*/}
        
        <div className="App">
          {/* LLM Loader */}
          <div style={{
            position:"fixed",
            top:"0px",
            left:"0px", 
            width:"100%",
            height:"100%",
            background:"rgb(0,10,30,0.5)",
            display: isLoaded ? "none" : "flex",
            justifyContent:"center",
            alignItems:"center",
            color:"#fff",
          }}>
            Starting LLM Inference...
          </div>

        </div>
      </>
    ) : 
    (
      <div style={{padding: "20px", textAlign:"center"}}>This app is only supported in Google Chrome</div> 
    )
  );
}

export default App;