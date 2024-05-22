
import { useEffect, useState } from 'react';  
import getLlmInference from './components/llm_inference';
import SimulationCanvas from './components/SimulationCanvas';
import './App.css';



class PromptQueue {
  constructor(llmInference) {
    this.llmInference = llmInference;
    this.queue = [];
    this.isRunning = false;
  }

  addPromptRequest(prompt, callback) {
    this.queue.push(
      {
        prompt: prompt,
        callback: callback,
        message: '',
      }
    );
    this.processQueue();
  }

  getResults(partialResults, complete, promptRequest, self) {
    promptRequest.message += partialResults;

    if (complete) {
      console.log("COMPLETE")
      promptRequest.callback(promptRequest.message);
      self.isRunning = false;

      // Timeout to lesses chance of overlap
      setTimeout(() => {
        self.processQueue();
      }, 200);
      
    }
  }

  processQueue() {
    if (!this.isRunning && this.queue.length > 0) {
      this.isRunning = true;
      const promptRequest = this.queue.shift();

      const results = this.getResults
      this.llmInference.generateResponse(
        promptRequest.prompt, 
        (partialResults, complete) =>  results(partialResults, complete, promptRequest, this)
      );
    }
  }
}

function App() {
  const userAgent = navigator.userAgent;
  const [isLoaded, setIsLoaded] = useState(false);
  const [llmInference, setLlmInference] = useState(null);
  const [promptQueue, setPromptQueue] = useState(null)

  useEffect(() => {  
    if (promptQueue != null) {
      setIsLoaded(true);
    }
  }, [promptQueue]);

  useEffect(() => {  
    if (llmInference != null) {
      setPromptQueue(new PromptQueue(llmInference))
      
    }
  }, [llmInference]);

  useEffect(() => { 
    getLlmInference().then(result => {
      setLlmInference(result);
    }).catch(error => {
      console.log(error)
    });
  }, []);


  return (
    userAgent.indexOf("Chrome") > -1 ? 
    (
      <>
        
        {isLoaded ? <SimulationCanvas promptQueue={promptQueue}/> : null}
        
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