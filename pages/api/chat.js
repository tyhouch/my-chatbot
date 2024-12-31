import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;

    // Prepend a 'developer' instruction to the conversation
    // (This ensures the model has a consistent persona or style.)
    const conversation = [
      { role: "assistant", content: "You are a helpful assistant." },
      ...messages,
    ];

    // Call the OpenAI chat completion endpoint with full conversation
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o",
      messages: conversation,
    });

    const assistantMessage = response.choices[0].message;

    // Return the new assistant message
    return res.status(200).json({ assistantMessage });
  } catch (error) {
    console.error("Error generating completion:", error);
    return res.status(500).json({ error: "Error generating text" });
  }
}
