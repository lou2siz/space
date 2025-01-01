import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a backend
});

export const processCommandWithLLM = async (command) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are a website control assistant. Convert user commands into structured actions.
          Available actions:
          - open: Opens a website (requires URL)
          - search: Performs a Google search (requires query)
          - minimize: Minimizes a specific window (requires index)
          - resize: Resizes a window (requires index and size)
          - close: Closes a specific window (requires index)
          
          Return JSON in format: { "action": "actionName", "params": { relevant parameters } }`
        },
        {
          role: "user",
          content: command
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error processing command:', error);
    return null;
  }
}; 