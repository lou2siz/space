import axios from 'axios';

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/opt-1.3b';

export const processCommandWithLLM = async (command) => {
  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      {
        inputs: `Convert this command into a JSON action: "${command}"
        Available actions are:
        - open: Opens a website (requires URL)
        - search: Performs a Google search (requires query)
        - minimize: Minimizes a window (requires index)
        - resize: Resizes a window (requires index and size)
        - close: Closes a window (requires index)
        
        Return only the JSON object.`,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the response text to extract JSON
    const jsonMatch = response.data[0].generated_text.match(/\{.*\}/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Error processing command:', error);
    return null;
  }
}; 