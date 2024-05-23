import React, { useEffect, useState } from 'react';
import '../App.css';
import './SimulationCanvas.css';
import { motion } from "framer-motion"


function SimulationDrawer(props) {
  const [isOpen, setIsOpen] = useState(false)

  // Variants
  const variants = {
    dormant: {
      x: 0,
    },
    ready: {
      x: -50,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    open: {
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      x: 690,
      transition: { duration: 0.3, ease: 'easeInOut', }
    }
  }
  
  useEffect(() => {  
    if (props.drawerContent) setIsOpen(true)
  }, [props.drawerContent]);
  
  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      initial="inactive"
      onAnimationComplete={() => {
        //setIsUnfurled(true);
      }}
      onClick={() => setIsOpen(false)}
      style={{
        position:"fixed",
        right:"0px",
        width:"650px",
        height:"100%", 
        background:"#fff",
        borderLeft: "1px solid #888",
        padding:"20px",
        boxShadow: "-8px 0px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      https://api.weather.gov/points/{37.8715},{122.2730}
      <br/>
      {props.drawerContent}
    </motion.div>
  );
}

export default SimulationDrawer;
