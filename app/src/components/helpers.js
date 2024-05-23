
const categories = {
  'a': "Location",
  'b': "Weather",
  'c': "Person",
  'd': "None",
}

const definitions = `
a) The text is about location or travel directions.
b) The text is about the weather.
c) The text is about a person.
d) The text is NOT about location and NOT about weather and NOT about a person.`

const intentTests = [
  {
    "question": "How far is Berkeley from San Francisco",
    "type": "Location"
  },{
    "question": "Where is New York?",
    "type": "Location"
  },{
    "question": "How long does it take to get from my house to My Coffee Roaster?",
    "type": "Location"
  },{
    "question": "Where is the closest gas station?",
    "type": "Location"
  },{
    "question": "How is San Jose?",
    "type": "Location"
  },{
    "question": "What's the weather going to be like in Berkeley?",
    "type": "Weather"
  },{
    "question": "Should I bring a coat with me today?",
    "type": "Weather"
  },{
    "question": "Is it going to rain?",
    "type": "Weather"
  },{
    "question": "How cold will it get this week?",
    "type": "Weather"
  },{
    "question": "What's the weather look like today?",
    "type": "Weather"
  },{
    "question": "When is it going to rain today?",
    "type": "Weather"
  },{
    "question": "Tell me about John Lennon.",
    "type": "Person"
  },{
    "question": "Who is John Lennon?",
    "type": "Person"
  },{
    "question": "Who is Teddy Roosevelt?",
    "type": "Person"
  },{
    "question": "Tell me about JFK",
    "type": "Person"
  },{
    "question": "What is Buckminster Fuller known for?",
    "type": "Person"
  },{
    "question": "Tell me about Barack Obama?",
    "type": "Person"
  },{
    "question": "What wine goes well with fish?",
    "type": "None"
  },{
    "question": "Do you like country music?",
    "type": "None"
  },{
    "question": "I want to make tacos.",
    "type": "None"
  },{
    "question": "What is a language model?",
    "type": "None"
  },{
    "question": "What is Google?",
    "type": "None"
  },{
    "question": "What is GMail?",
    "type": "None"
  },
]

export { categories, intentTests, definitions };
