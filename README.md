# ExamHelper app

God bless your INŻYNIERKA!

## Deploy to Azure - required to use AI features

Use this link to deploy to Azure:
https://oai.azure.com/resource/deployments

MAKE SURE TO CALL **YOUR AZURE MODELS** AS **gpt-4** or **gpt-35-turbo** - you won't need to change the model names in the code

Create a `.env` file based on the `.env.example` file.

```env
REACT_APP_AZURE_ENDPOINT=https://xxxxxxxxxxx-westeurope.openai.azure.com
REACT_APP_AZURE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_AZURE_API_VERSION=2024-01-01-preview
```

MAKE SURE TO CALL **YOUR AZURE MODELS** AS **gpt-4** or **gpt-35-turbo** - you won't need to change the model names in the code

- `REACT_APP_AZURE_ENDPOINT` - Your Azure OpenAI API endpoint | **DO NOT ADD ANYTHING AFTER THE .com**
- `REACT_APP_AZURE_API_KEY` - Your Azure OpenAI API key
- `REACT_APP_AZURE_API_VERSION` - Azure OpenAI API version (e.g., "2024-02-15-preview")

## Setup

### Option 1: Local Dev

0. Make sure you have a `.env` file with your Azure credentials

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm dev:server
```

3. In new terminal start the React app:

```bash
npm dev:client
```

### Option 2: Docker Deployment

0. Make sure you have a `.env` file with your Azure credentials

1. Build and run with Docker Compose:

```bash
docker-compose up --build
```

To stop the container:

```bash
docker-compose down
```

### Accessing the app

The app will be available at http://localhost:3000

### Then you need to upload three files:

1. `data.in` file with questions in format:

   <br/>

   `question_number`   `subject_name`   `semester`   `category`
   
   <br/>
   examples:

   2 Algorytmy i struktury danych 4 --- Kim jest Marek Marucha?

   1 Teoria Kompilacji 2 ALGO Kim jest Automatow?

   <br/>

   You have three categories that you can only choose one from later on:
   - `ALGO`
   - `WO`
   - `ALAP`
   
   and always present, general questions:
   - PYTANIA GENERALNE(marked as `---`) 

   <br/>

   See example file `data.in.example`

   <br/>

2. `Opracowanie_1.pdf` pdf file with answers to questions

   <br/>

3. `Opracowanie_2.pdf` other pdf file with answers to questions

   <br/>

Files doesn't need to have names like `Opracowanie_1.pdf` or `Opracowanie_2.pdf` or 'data.in' - just make sure they are in a correct format.

## Features

You can:

- Filter questions by category, semester, and subject
- Create a note with help of PDF files and AI
- Mark questions as answered
- Do Q&A session with Azure OpenAI (GPT-3.5-TURBO or GPT-4)
