
const categories = {
  'a': "Location",
  'b': "Weather",
  'c': "People",
  'd': "None",
}

const definitions = `
a) The text is related to location.
b) The text is related to the weather.
c) The text is related to people.
d) The text is not related to location or the weather or people.`

const intentTests = [
    {
      "question": "Will I need a coat tomorrow?",
      "type": "Weather"
  },
  {
    "question": "What is FDR known for?",
    "type": "People"
  },
  {
      "question": "What did Albert Einstein do?",
      "type": "People"
  },
  {
      "question": "Who is the current president of the United States?",
      "type": "People"
  },
  {
      "question": "Who was Cleopatra?",
      "type": "People"
  },
  {
      "question": "What achievements is Nelson Mandela famous for?",
      "type": "People"
  },
  {
      "question": "Who wrote 'Romeo and Juliet'?",
      "type": "People"
  },
  {
      "question": "What are some facts about Martin Luther King Jr.?",
      "type": "People"
  },
  {
      "question": "What is J.K. Rowling known for?",
      "type": "People"
  },
  {
      "question": "What did Steve Jobs invent?",
      "type": "People"
  },
  {
      "question": "Who is Malala Yousafzai?",
      "type": "People"
  },
  {
      "question": "What is Mahatma Gandhi known for?",
      "type": "People"
  },
  {
      "question": "Who was Winston Churchill?",
      "type": "People"
  },
  {
      "question": "What did Leonardo da Vinci do?",
      "type": "People"
  },
  {
      "question": "Can you tell me about Rosa Parks?",
      "type": "People"
  },
  {
      "question": "Who was Frida Kahlo?",
      "type": "People"
  },
  {
      "question": "What is Ada Lovelace known for?",
      "type": "People"
  },
  ]

/*
const intentTests = [
  {
      "question": "Should I wear a coat tomorrow?",
      "type": "Weather"
  },
  {
      "question": "Will I need an umbrella this Friday?",
      "type": "Weather"
  },
  {
      "question": "What’s the weather like this week?",
      "type": "Weather"
  },
  {
      "question": "Is it going to rain today?",
      "type": "Weather"
  },
  {
      "question": "What’s the temperature right now?",
      "type": "Weather"
  },
  {
      "question": "Will it snow this weekend?",
      "type": "Weather"
  },
  {
      "question": "How windy is it outside?",
      "type": "Weather"
  },
  {
      "question": "Should I take a jacket with me?",
      "type": "Weather"
  },
  {
      "question": "Is it sunny outside?",
      "type": "Weather"
  },
  {
      "question": "Will there be a thunderstorm tonight?",
      "type": "Weather"
  },
  {
      "question": "What’s the forecast for tomorrow?",
      "type": "Weather"
  },
  {
      "question": "Do I need sunscreen today?",
      "type": "Weather"
  },
  {
      "question": "Is there a chance of hail?",
      "type": "Weather"
  },
  {
      "question": "How hot will it get today?",
      "type": "Weather"
  },
  {
      "question": "Is there a weather warning in effect?",
      "type": "Weather"
  },
  {
      "question": "What’s the humidity level today?",
      "type": "Weather"
  },
  {
      "question": "Should I expect fog this morning?",
      "type": "Weather"
  },
  {
      "question": "What’s the UV index for today?",
      "type": "Weather"
  },
  {
      "question": "How cold will it be tonight?",
      "type": "Weather"
  },
  {
      "question": "Is it safe to drive in this weather?",
      "type": "Weather"
  },
  {
      "question": "Will the temperature drop below freezing?",
      "type": "Weather"
  },
  {
      "question": "Is it going to be cloudy all day?",
      "type": "Weather"
  },
  {
      "question": "What’s the dew point right now?",
      "type": "Weather"
  },
  {
      "question": "Should I cancel my outdoor plans?",
      "type": "Weather"
  },
  {
      "question": "Is there a heatwave coming?",
      "type": "Weather"
  },
  {
      "question": "How much rain is expected?",
      "type": "Weather"
  },
  {
      "question": "Will there be any lightning?",
      "type": "Weather"
  },
  {
      "question": "What’s the wind chill factor today?",
      "type": "Weather"
  },
  {
      "question": "Is it a good day for a picnic?",
      "type": "Weather"
  },
  {
      "question": "How long will the rain last?",
      "type": "Weather"
  },
  {
      "question": "Are there any tornado warnings?",
      "type": "Weather"
  },
  {
      "question": "What’s the barometric pressure today?",
      "type": "Weather"
  },
  {
      "question": "Is it going to be a clear night?",
      "type": "Weather"
  },
  {
      "question": "Should I bring a hat to keep warm?",
      "type": "Weather"
  },
  {
      "question": "Is the air quality good today?",
      "type": "Weather"
  },
  {
      "question": "How strong are the winds?",
      "type": "Weather"
  },
  {
      "question": "What time will the sun set today?",
      "type": "Weather"
  },
  {
      "question": "Will the weather affect my flight?",
      "type": "Weather"
  },
  {
      "question": "Is there a blizzard on the way?",
      "type": "Weather"
  },
  {
      "question": "What’s the weather like at the beach?",
      "type": "Weather"
  },
  {
      "question": "Should I prepare for a hurricane?",
      "type": "Weather"
  },
  {
      "question": "How long will the sunshine last?",
      "type": "Weather"
  },
  {
      "question": "Will it be humid today?",
      "type": "Weather"
  },
  {
      "question": "Is it a good day for a hike?",
      "type": "Weather"
  },
  {
      "question": "How severe will the storm be?",
      "type": "Weather"
  },
  {
      "question": "Are there any flood warnings?",
      "type": "Weather"
  },
  {
      "question": "What’s the visibility like outside?",
      "type": "Weather"
  },
  {
      "question": "Should I wear layers today?",
      "type": "Weather"
  },
  {
      "question": "How’s the weather looking for the weekend?",
      "type": "Weather"
  },
  {
      "question": "Is there a frost advisory?",
      "type": "Weather"
  },
  {
      "question": "Will it be warm enough to go swimming?",
      "type": "Weather"
  },
  {
      "question": "Is there a risk of a landslide due to rain?",
      "type": "Weather"
  },
  {
      "question": "Should I keep my windows closed today?",
      "type": "Weather"
  },
  {
      "question": "What is the capital of France?",
      "type": "Location"
  },
  {
      "question": "How far is Berkeley from San Francisco?",
      "type": "Location"
  },
  {
      "question": "Where is the Taj Mahal?",
      "type": "Location"
  },
  {
      "question": "What are the top tourist attractions in Paris?",
      "type": "Location"
  },
  {
      "question": "Where is the Great Wall of China located?",
      "type": "Location"
  },
  {
      "question": "How far is it from New York to Los Angeles?",
      "type": "Location"
  },
  {
      "question": "Which country is the Eiffel Tower in?",
      "type": "Location"
  },
  {
      "question": "Where is the nearest gas station?",
      "type": "Location"
  },
  {
      "question": "Can you give me directions to the airport?",
      "type": "Location"
  },
  {
      "question": "Where is the Amazon Rainforest located?",
      "type": "Location"
  },
  {
      "question": "What are the best places to visit in Japan?",
      "type": "Location"
  },
  {
      "question": "Where is Mount Everest?",
      "type": "Location"
  },
  {
      "question": "What is the capital of Australia?",
      "type": "Location"
  },
  {
      "question": "How do I get to Central Park?",
      "type": "Location"
  },
  {
      "question": "Where can I find the Statue of Liberty?",
      "type": "Location"
  },
  {
      "question": "What is the distance between London and Paris?",
      "type": "Location"
  },
  {
      "question": "Which continent is Egypt in?",
      "type": "Location"
  },
  {
      "question": "What is the largest city in Canada?",
      "type": "Location"
  },
  {
      "question": "Where is the Colosseum?",
      "type": "Location"
  },
  {
      "question": "How far is it from Sydney to Melbourne?",
      "type": "Location"
  },
  {
      "question": "Where is the Leaning Tower of Pisa?",
      "type": "Location"
  },
  {
      "question": "What country is Machu Picchu in?",
      "type": "Location"
  },
  {
      "question": "Where is the closest hospital?",
      "type": "Location"
  },
  {
      "question": "What are some landmarks in Rome?",
      "type": "Location"
  },
  {
      "question": "How do I get to the Louvre Museum?",
      "type": "Location"
  },
  {
      "question": "Where is Disneyland located?",
      "type": "Location"
  },
  {
      "question": "What state is the Grand Canyon in?",
      "type": "Location"
  },
  {
      "question": "Where can I find the Pyramids of Giza?",
      "type": "Location"
  },
  {
      "question": "How far is Miami from Orlando?",
      "type": "Location"
  },
  {
      "question": "Where is Buckingham Palace?",
      "type": "Location"
  },
  {
      "question": "What is the population of Tokyo?",
      "type": "Location"
  },
  {
      "question": "Where is the Berlin Wall located?",
      "type": "Location"
  },
  {
      "question": "How do I get to the Golden Gate Bridge?",
      "type": "Location"
  },
  {
      "question": "What is the capital of Brazil?",


      "type": "Location"
  },
  {
      "question": "Where is the Sydney Opera House?",
      "type": "Location"
  },
  {
      "question": "Where can I see the Northern Lights?",
      "type": "Location"
  },
  {
      "question": "What are some popular places in New York City?",
      "type": "Location"
  },
  {
      "question": "Where is the Kremlin located?",
      "type": "Location"
  },
  {
      "question": "What river runs through Cairo?",
      "type": "Location"
  },
  {
      "question": "Where is the Acropolis?",
      "type": "Location"
  },
  {
      "question": "What country is the city of Barcelona in?",
      "type": "Location"
  },
  {
      "question": "Where is Niagara Falls?",
      "type": "Location"
  },
  {
      "question": "What country is the Sahara Desert in?",
      "type": "Location"
  },
  {
      "question": "What are the major cities in India?",
      "type": "Location"
  },
  {
      "question": "Where is the Petronas Towers located?",
      "type": "Location"
  },
  {
      "question": "What is the capital of Italy?",
      "type": "Location"
  },
  {
      "question": "How do I get to the Empire State Building?",
      "type": "Location"
  },
  {
      "question": "Where is the nearest train station?",
      "type": "Location"
  },
  {
      "question": "What is the tallest building in the world?",
      "type": "Location"
  },
  {
      "question": "Where is the Great Barrier Reef?",
      "type": "Location"
  },
  {
      "question": "What are some historical sites in Greece?",
      "type": "Location"
  },
  {
      "question": "How far is Las Vegas from Los Angeles?",
      "type": "Location"
  },
  {
      "question": "Where is the Burj Khalifa?",
      "type": "Location"
  },
  {
      "question": "Where is the nearest airport?",
      "type": "Location"
  },
  {
      "question": "What’s the best way to get to the Eiffel Tower?",
      "type": "Location"
  },
  {
      "question": "What did Albert Einstein do?",
      "type": "People"
  },
  {
      "question": "Who is the current president of the United States?",
      "type": "People"
  },
  {
      "question": "Who was Cleopatra?",
      "type": "People"
  },
  {
      "question": "What achievements is Nelson Mandela famous for?",
      "type": "People"
  },
  {
      "question": "Who wrote 'Romeo and Juliet'?",
      "type": "People"
  },
  {
      "question": "What are some facts about Martin Luther King Jr.?",
      "type": "People"
  },
  {
      "question": "Who is J.K. Rowling?",
      "type": "People"
  },
  {
      "question": "What did Steve Jobs invent?",
      "type": "People"
  },
  {
      "question": "Who is Malala Yousafzai?",
      "type": "People"
  },
  {
      "question": "What is Mahatma Gandhi known for?",
      "type": "People"
  },
  {
      "question": "Who was Winston Churchill?",
      "type": "People"
  },
  {
      "question": "What did Leonardo da Vinci do?",
      "type": "People"
  },
  {
      "question": "Can you tell me about Rosa Parks?",
      "type": "People"
  },
  {
      "question": "Who was Frida Kahlo?",
      "type": "People"
  },
  {
      "question": "What are some accomplishments of Ada Lovelace?",
      "type": "People"
  },
  {
      "question": "What is Elon Musk known for?",
      "type": "People"
  },
  {
      "question": "Who is the CEO of Amazon?",
      "type": "People"
  },
  {
      "question": "What is Barack Obama famous for?",
      "type": "People"
  },
  {
      "question": "Who is Serena Williams?",
      "type": "People"
  },
  {
      "question": "What are some famous works of Vincent van Gogh?",
      "type": "People"
  },
  {
      "question": "Who was Marie Curie?",
      "type": "People"
  },
  {
      "question": "What did Nikola Tesla invent?",
      "type": "People"
  },
  {
      "question": "Who is known as the father of computer science?",
      "type": "People"
  },
  {
      "question": "What did Thomas Edison invent?",
      "type": "People"
  },
  {
      "question": "Who is Oprah Winfrey?",
      "type": "People"
  },
  {
      "question": "What is Mark Zuckerberg known for?",
      "type": "People"
  },
  {
      "question": "Who is the author of 'Harry Potter'?",
      "type": "People"
  },
  {
      "question": "Who is the founder of Microsoft?",
      "type": "People"
  },
  {
      "question": "What is Stephen Hawking famous for?",
      "type": "People"
  },
  {
      "question": "Who is Greta Thunberg?",
      "type": "People"
  },
  {
      "question": "Who painted the Mona Lisa?",
      "type": "People"
  },
  {
      "question": "What is Nelson Mandela known for?",
      "type": "People"
  },
  {
      "question": "Who was the first person to walk on the moon?",
      "type": "People"
  },
  {
      "question": "What is Bill Gates famous for?",
      "type": "People"
  },
  {
      "question": "Who is the Dalai Lama?",
      "type": "People"
  },
  {
      "question": "What did Sigmund Freud study?",
      "type": "People"
  },
  {
      "question": "Who is the prime minister of the UK?",
      "type": "People"
  },
  {
      "question": "Who was the first female prime minister of India?",
      "type": "People"
  },
  {
      "question": "What is Angela Merkel known for?",
      "type": "People"
  },
  {
      "question": "Who is the president of Russia?",
      "type": "People"
  },
  {
      "question": "Who wrote 'Pride and Prejudice'?",
      "type": "People"
  },
  {
      "question": "Who was the first president of the United States?",
      "type": "People"
  },
  {
      "question": "What is Beyoncé famous for?",
      "type": "People"
  },
  {
      "question": "Who is known as the king of pop?",
      "type": "People"
  },
  {
      "question": "What did Charles Darwin discover?",
      "type": "People"
  },
  {
      "question": "Who was the main figure in the Cuban revolution?",
      "type": "People"
  },
  {
      "question": "Who was the ancient Greek philosopher who taught Alexander the Great?",
      "type": "People"
  },
  {
      "question": "What is Mother Teresa known for?",
      "type": "People"
  },
  {
      "question": "Who was the leader of the Soviet Union during World War II?",
      "type": "People"
  },
  {
      "question": "What are some famous quotes by Mahatma Gandhi?",
      "type": "People"
  },
  {
      "question": "Who was the first woman to fly solo across the Atlantic?",
      "type": "People"
  },
  {
      "question": "Who was the first African American president of the United States?",
      "type": "People"
  }
]


const intentTests = [
  {
    "question": "I'll be in San Francisco tomorrow. Should I wear a coat?",
    "type": "Weather"
  },
  {
    "question": "Who was Cleopatra?",
    "type": "People"
  },
  {
      "question": "What achievements is Nelson Mandela famous for?",
      "type": "People"
  },
  {
      "question": "Who wrote 'Romeo and Juliet'?",
      "type": "People"
  },
  {
      "question": "What are some facts about Martin Luther King Jr.?",
      "type": "People"
  },
  {
      "question": "What is J.K. Rowling known for?",
      "type": "People"
  },
]

const intentTests = [
    {
        "question": "Should I wear a coat tomorrow?",
        "type": "Weather"
    },
    {
        "question": "Will I need an umbrella this Friday?",
        "type": "Weather"
    },
    {
        "question": "What’s the weather like this week?",
        "type": "Weather"
    },
    {
        "question": "Is it going to rain today?",
        "type": "Weather"
    },
    {
        "question": "What’s the temperature right now?",
        "type": "Weather"
    },
    {
        "question": "Will it snow this weekend?",
        "type": "Weather"
    },
    {
        "question": "How windy is it outside?",
        "type": "Weather"
    },
    {
        "question": "Should I take a jacket with me?",
        "type": "Weather"
    },
    {
        "question": "Is it sunny outside?",
        "type": "Weather"
    },
    {
        "question": "Will there be a thunderstorm tonight?",
        "type": "Weather"
    },
    {
        "question": "What’s the forecast for tomorrow?",
        "type": "Weather"
    },
    {
        "question": "Do I need sunscreen today?",
        "type": "Weather"
    },
    {
        "question": "Is there a chance of hail?",
        "type": "Weather"
    },
    {
        "question": "How hot will it get today?",
        "type": "Weather"
    },
    {
        "question": "Is there a weather warning in effect?",
        "type": "Weather"
    },
    {
        "question": "What’s the humidity level today?",
        "type": "Weather"
    },
    {
        "question": "Should I expect fog this morning?",
        "type": "Weather"
    },
    {
        "question": "What’s the UV index for today?",
        "type": "Weather"
    },
    {
        "question": "How cold will it be tonight?",
        "type": "Weather"
    },
    {
        "question": "Is it safe to drive in this weather?",
        "type": "Weather"
    },
    {
        "question": "Will the temperature drop below freezing?",
        "type": "Weather"
    },
    {
        "question": "Is it going to be cloudy all day?",
        "type": "Weather"
    },
    {
        "question": "What’s the dew point right now?",
        "type": "Weather"
    },
    {
        "question": "Should I cancel my outdoor plans?",
        "type": "Weather"
    },
    {
        "question": "Is there a heatwave coming?",
        "type": "Weather"
    },
    {
        "question": "How much rain is expected?",
        "type": "Weather"
    },
    {
        "question": "Will there be any lightning?",
        "type": "Weather"
    },
    {
        "question": "What’s the wind chill factor today?",
        "type": "Weather"
    },
    {
        "question": "Is it a good day for a picnic?",
        "type": "Weather"
    },
    {
        "question": "How long will the rain last?",
        "type": "Weather"
    },
    {
        "question": "Are there any tornado warnings?",
        "type": "Weather"
    },
    {
        "question": "What’s the barometric pressure today?",
        "type": "Weather"
    },
    {
        "question": "Is it going to be a clear night?",
        "type": "Weather"
    },
    {
        "question": "Should I bring a hat to keep warm?",
        "type": "Weather"
    },
    {
        "question": "Is the air quality good today?",
        "type": "Weather"
    },
    {
        "question": "How strong are the winds?",
        "type": "Weather"
    },
    {
        "question": "What time will the sun set today?",
        "type": "Weather"
    },
    {
        "question": "Will the weather affect my flight?",
        "type": "Weather"
    },
    {
        "question": "Is there a blizzard on the way?",
        "type": "Weather"
    },
    {
        "question": "What’s the weather like at the beach?",
        "type": "Weather"
    },
    {
        "question": "Should I prepare for a hurricane?",
        "type": "Weather"
    },
    {
        "question": "How long will the sunshine last?",
        "type": "Weather"
    },
    {
        "question": "Will it be humid today?",
        "type": "Weather"
    },
    {
        "question": "Is it a good day for a hike?",
        "type": "Weather"
    },
    {
        "question": "How severe will the storm be?",
        "type": "Weather"
    },
    {
        "question": "Are there any flood warnings?",
        "type": "Weather"
    },
    {
        "question": "What’s the visibility like outside?",
        "type": "Weather"
    },
    {
        "question": "Should I wear layers today?",
        "type": "Weather"
    },
    {
        "question": "How’s the weather looking for the weekend?",
        "type": "Weather"
    },
    {
        "question": "Is there a frost advisory?",
        "type": "Weather"
    },
    {
        "question": "Will it be warm enough to go swimming?",
        "type": "Weather"
    },
    {
        "question": "Is there a risk of a landslide due to rain?",
        "type": "Weather"
    },
    {
        "question": "Should I keep my windows closed today?",
        "type": "Weather"
    },
    {
        "question": "What is the capital of France?",
        "type": "Location"
    },
    {
        "question": "How far is Berkeley from San Francisco?",
        "type": "Location"
    },
    {
        "question": "Where is the Taj Mahal?",
        "type": "Location"
    },
    {
        "question": "What are the top tourist attractions in Paris?",
        "type": "Location"
    },
    {
        "question": "Where is the Great Wall of China located?",
        "type": "Location"
    },
    {
        "question": "How far is it from New York to Los Angeles?",
        "type": "Location"
    },
    {
        "question": "Which country is the Eiffel Tower in?",
        "type": "Location"
    },
    {
        "question": "Where is the nearest gas station?",
        "type": "Location"
    },
    {
        "question": "Can you give me directions to the airport?",
        "type": "Location"
    },
    {
        "question": "Where is the Amazon Rainforest located?",
        "type": "Location"
    },
    {
        "question": "What are the best places to visit in Japan?",
        "type": "Location"
    },
    {
        "question": "Where is Mount Everest?",
        "type": "Location"
    },
    {
        "question": "What is the capital of Australia?",
        "type": "Location"
    },
    {
        "question": "How do I get to Central Park?",
        "type": "Location"
    },
    {
        "question": "Where can I find the Statue of Liberty?",
        "type": "Location"
    },
    {
        "question": "What is the distance between London and Paris?",
        "type": "Location"
    },
    {
        "question": "Which continent is Egypt in?",
        "type": "Location"
    },
    {
        "question": "What is the largest city in Canada?",
        "type": "Location"
    },
    {
        "question": "Where is the Colosseum?",
        "type": "Location"
    },
    {
        "question": "How far is it from Sydney to Melbourne?",
        "type": "Location"
    },
    {
        "question": "Where is the Leaning Tower of Pisa?",
        "type": "Location"
    },
    {
        "question": "What country is Machu Picchu in?",
        "type": "Location"
    },
    {
        "question": "Where is the closest hospital?",
        "type": "Location"
    },
    {
        "question": "What are some landmarks in Rome?",
        "type": "Location"
    },
    {
        "question": "How do I get to the Louvre Museum?",
        "type": "Location"
    },
    {
        "question": "Where is Disneyland located?",
        "type": "Location"
    },
    {
        "question": "What state is the Grand Canyon in?",
        "type": "Location"
    },
    {
        "question": "Where can I find the Pyramids of Giza?",
        "type": "Location"
    },
    {
        "question": "How far is Miami from Orlando?",
        "type": "Location"
    },
    {
        "question": "Where is Buckingham Palace?",
        "type": "Location"
    },
    {
        "question": "What is the population of Tokyo?",
        "type": "Location"
    },
    {
        "question": "Where is the Berlin Wall located?",
        "type": "Location"
    },
    {
        "question": "How do I get to the Golden Gate Bridge?",
        "type": "Location"
    },
    {
        "question": "What is the capital of Brazil?",


        "type": "Location"
    },
    {
        "question": "Where is the Sydney Opera House?",
        "type": "Location"
    },
    {
        "question": "Where can I see the Northern Lights?",
        "type": "Location"
    },
    {
        "question": "What are some popular places in New York City?",
        "type": "Location"
    },
    {
        "question": "Where is the Kremlin located?",
        "type": "Location"
    },
    {
        "question": "What river runs through Cairo?",
        "type": "Location"
    },
    {
        "question": "Where is the Acropolis?",
        "type": "Location"
    },
    {
        "question": "What country is the city of Barcelona in?",
        "type": "Location"
    },
    {
        "question": "Where is Niagara Falls?",
        "type": "Location"
    },
    {
        "question": "What country is the Sahara Desert in?",
        "type": "Location"
    },
    {
        "question": "What are the major cities in India?",
        "type": "Location"
    },
    {
        "question": "Where is the Petronas Towers located?",
        "type": "Location"
    },
    {
        "question": "What is the capital of Italy?",
        "type": "Location"
    },
    {
        "question": "How do I get to the Empire State Building?",
        "type": "Location"
    },
    {
        "question": "Where is the nearest train station?",
        "type": "Location"
    },
    {
        "question": "What is the tallest building in the world?",
        "type": "Location"
    },
    {
        "question": "Where is the Great Barrier Reef?",
        "type": "Location"
    },
    {
        "question": "What are some historical sites in Greece?",
        "type": "Location"
    },
    {
        "question": "How far is Las Vegas from Los Angeles?",
        "type": "Location"
    },
    {
        "question": "Where is the Burj Khalifa?",
        "type": "Location"
    },
    {
        "question": "Where is the nearest airport?",
        "type": "Location"
    },
    {
        "question": "What’s the best way to get to the Eiffel Tower?",
        "type": "Location"
    },
    {
        "question": "What did Albert Einstein do?",
        "type": "People"
    },
    {
        "question": "Who is the current president of the United States?",
        "type": "People"
    },
    {
        "question": "Who was Cleopatra?",
        "type": "People"
    },
    {
        "question": "What achievements is Nelson Mandela famous for?",
        "type": "People"
    },
    {
        "question": "Who wrote 'Romeo and Juliet'?",
        "type": "People"
    },
    {
        "question": "What are some facts about Martin Luther King Jr.?",
        "type": "People"
    },
    {
        "question": "Who is J.K. Rowling?",
        "type": "People"
    },
    {
        "question": "What did Steve Jobs invent?",
        "type": "People"
    },
    {
        "question": "Who is Malala Yousafzai?",
        "type": "People"
    },
    {
        "question": "What is Mahatma Gandhi known for?",
        "type": "People"
    },
    {
        "question": "Who was Winston Churchill?",
        "type": "People"
    },
    {
        "question": "What did Leonardo da Vinci do?",
        "type": "People"
    },
    {
        "question": "Can you tell me about Rosa Parks?",
        "type": "People"
    },
    {
        "question": "Who was Frida Kahlo?",
        "type": "People"
    },
    {
        "question": "What are some accomplishments of Ada Lovelace?",
        "type": "People"
    },
    {
        "question": "What is Elon Musk known for?",
        "type": "People"
    },
    {
        "question": "Who is the CEO of Amazon?",
        "type": "People"
    },
    {
        "question": "What is Barack Obama famous for?",
        "type": "People"
    },
    {
        "question": "Who is Serena Williams?",
        "type": "People"
    },
    {
        "question": "What are some famous works of Vincent van Gogh?",
        "type": "People"
    },
    {
        "question": "Who was Marie Curie?",
        "type": "People"
    },
    {
        "question": "What did Nikola Tesla invent?",
        "type": "People"
    },
    {
        "question": "Who is known as the father of computer science?",
        "type": "People"
    },
    {
        "question": "What did Thomas Edison invent?",
        "type": "People"
    },
    {
        "question": "Who is Oprah Winfrey?",
        "type": "People"
    },
    {
        "question": "What is Mark Zuckerberg known for?",
        "type": "People"
    },
    {
        "question": "Who is the author of 'Harry Potter'?",
        "type": "People"
    },
    {
        "question": "Who is the founder of Microsoft?",
        "type": "People"
    },
    {
        "question": "What is Stephen Hawking famous for?",
        "type": "People"
    },
    {
        "question": "Who is Greta Thunberg?",
        "type": "People"
    },
    {
        "question": "Who painted the Mona Lisa?",
        "type": "People"
    },
    {
        "question": "What is Nelson Mandela known for?",
        "type": "People"
    },
    {
        "question": "Who was the first person to walk on the moon?",
        "type": "People"
    },
    {
        "question": "What is Bill Gates famous for?",
        "type": "People"
    },
    {
        "question": "Who is the Dalai Lama?",
        "type": "People"
    },
    {
        "question": "What did Sigmund Freud study?",
        "type": "People"
    },
    {
        "question": "Who is the prime minister of the UK?",
        "type": "People"
    },
    {
        "question": "Who was the first female prime minister of India?",
        "type": "People"
    },
    {
        "question": "What is Angela Merkel known for?",
        "type": "People"
    },
    {
        "question": "Who is the president of Russia?",
        "type": "People"
    },
    {
        "question": "Who wrote 'Pride and Prejudice'?",
        "type": "People"
    },
    {
        "question": "Who was the first president of the United States?",
        "type": "People"
    },
    {
        "question": "What is Beyoncé famous for?",
        "type": "People"
    },
    {
        "question": "Who is known as the king of pop?",
        "type": "People"
    },
    {
        "question": "What did Charles Darwin discover?",
        "type": "People"
    },
    {
        "question": "Who was the main figure in the Cuban revolution?",
        "type": "People"
    },
    {
        "question": "Who was the ancient Greek philosopher who taught Alexander the Great?",
        "type": "People"
    },
    {
        "question": "What is Mother Teresa known for?",
        "type": "People"
    },
    {
        "question": "Who was the leader of the Soviet Union during World War II?",
        "type": "People"
    },
    {
        "question": "What are some famous quotes by Mahatma Gandhi?",
        "type": "People"
    },
    {
        "question": "Who was the first woman to fly solo across the Atlantic?",
        "type": "People"
    },
    {
        "question": "Who was the first African American president of the United States?",
        "type": "People"
    }
]

const intentTests = [
  {
    "question": "Will I need a coat tomorrow?",
    "type": "Weather"
},
{
  "question": "What is FDR known for?",
  "type": "People"
},
{
    "question": "What did Albert Einstein do?",
    "type": "People"
},
{
    "question": "Who is the current president of the United States?",
    "type": "People"
},
{
    "question": "Who was Cleopatra?",
    "type": "People"
},
{
    "question": "What achievements is Nelson Mandela famous for?",
    "type": "People"
},
{
    "question": "Who wrote 'Romeo and Juliet'?",
    "type": "People"
},
{
    "question": "What are some facts about Martin Luther King Jr.?",
    "type": "People"
},
{
    "question": "What is J.K. Rowling known for?",
    "type": "People"
},
{
    "question": "What did Steve Jobs invent?",
    "type": "People"
},
{
    "question": "Who is Malala Yousafzai?",
    "type": "People"
},
{
    "question": "What is Mahatma Gandhi known for?",
    "type": "People"
},
{
    "question": "Who was Winston Churchill?",
    "type": "People"
},
{
    "question": "What did Leonardo da Vinci do?",
    "type": "People"
},
{
    "question": "Can you tell me about Rosa Parks?",
    "type": "People"
},
{
    "question": "Who was Frida Kahlo?",
    "type": "People"
},
{
    "question": "What is Ada Lovelace known for?",
    "type": "People"
},
]

const intentTests = [
  {
    "question": "Should I wear a coat tomorrow?",
    "type": "Weather"
  },
  {
      "question": "Will I need an umbrella this Friday?",
      "type": "Weather"
  },
  {
      "question": "What’s the weather like this week?",
      "type": "Weather"
  },
  {
      "question": "Is it going to rain today?",
      "type": "Weather"
  },
  {
      "question": "What’s the temperature right now?",
      "type": "Weather"
  },
  {
      "question": "Will it snow this weekend?",
      "type": "Weather"
  },
  {
      "question": "How windy is it outside?",
      "type": "Weather"
  },
]
*/







export { categories, intentTests, definitions }