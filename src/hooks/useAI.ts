import { useState } from 'react';
import { getAzureCompletion } from '../services/azure';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");

  const handleSelectedQuestion = async (question: string, subject: string, modelName: string = "gpt35turbo") => {
    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const apiVersion = process.env.REACT_APP_AZURE_API_VERSION;
      const formattedModelName = modelName.toLowerCase().replace(".", "");
      if (!apiVersion) {
        throw new Error("Missing Azure API version");
      }
      const response = await getAzureCompletion({
        question,
        subject,
        modelName: formattedModelName,
        apiVersion,
      });

      setAnswer(response);
    } catch (err) {
      setError("Failed to get answer. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, answer, handleSelectedQuestion, setAnswer, setError };
};