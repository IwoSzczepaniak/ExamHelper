import axios from 'axios';

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
}

const SYSTEM_PROMPT = `
You are a helpful IT specialist that answers questions accurately and concisely. 
<requirements>
- Use max 500 tokens
- Use only Polish language
- DO NOT USE MARKDOWN
- Try to be as accurate as possible
</requirements>`;

export async function getAzureCompletion(
  {question,
  subject,
  modelName,
  apiVersion,
  temperature = 0.9,
  maxTokens,
  systemPrompt = SYSTEM_PROMPT,
}: {
  question: string;
  subject: string;
  modelName: string;
  apiVersion: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}) {
  const endpoint = process.env.REACT_APP_AZURE_ENDPOINT;
  const apiKey = process.env.REACT_APP_AZURE_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error('Missing Azure credentials');
  }

  const url = `${endpoint}/openai/deployments/${modelName}/chat/completions?api-version=${apiVersion}`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `${systemPrompt}\n<subject>${subject}</subject>`,
    },
    {
      role: 'user',
      content: question,
    },
  ];

  try {
    const response = await axios.post(
      url,
      {
        messages,
        max_tokens: maxTokens,
        temperature,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Azure API error:', error);
    throw new Error('Failed to get response from Azure');
  }
} 