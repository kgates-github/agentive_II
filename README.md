# Agentic II
Agentic II runs tests to explore UX for a multi-agent chat interface.

NOTE: This app requires a current version of Google Chrome browser to run.

To run:
* Download a copy of [gemma-2b-it-gpu-int4.bin](https://www.kaggle.com/models/google/gemma/tfLite/gemma-2b-it-gpu-int4)
* Put gemma-2b-it-gpu-int4.bin in the public directory:
```
/app/public/gemma-2b-it-gpu-int4.bin
```
* Create venv:
```
python3 -m venv venv
source venv/bin/activate
```
* Install:
```
cd app/
npm install
```
* Add OpenAI API key to to env in your root directory:
```
echo 'OPENAI_API_KEY="your_api_key_here"' >> .env
touch .env
```
* Run:
```
npm start
```


```