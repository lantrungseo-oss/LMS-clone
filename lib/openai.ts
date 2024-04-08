import OpenAI from 'openai'

export const openAI = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
