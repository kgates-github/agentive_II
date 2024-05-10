import logo from './logo.svg';
import { useEffect, useState } from 'react';  
import getLlmInference from './components/llm_inference';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [llmInference, setLlmInference] = useState(null);
  const [llmIsProcessing, setLlmIsProcessing] = useState(false);


  useEffect(() => {  
    if (llmInference != null) {
      setIsLoaded(true); 
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
  );
}

export default App;
