'use server';
/**
 * @fileOverview An AI agent that answers questions with visual outputs.
 *
 * - visualQAndA - A function that answers questions with visual outputs.
 * - VisualQAndAInput - The input type for the visualQAndA function.
 * - VisualQAndAOutput - The return type for the visualQAndA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualQAndAInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
});
export type VisualQAndAInput = z.infer<typeof VisualQAndAInputSchema>;

const VisualQAndAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  imageUrl: z.string().describe('URL of the generated image.'),
});
export type VisualQAndAOutput = z.infer<typeof VisualQAndAOutputSchema>;

export async function visualQAndA(input: VisualQAndAInput): Promise<VisualQAndAOutput> {
  return visualQAndAFlow(input);
}

const visualQAndAPrompt = ai.definePrompt({
  name: 'visualQAndAPrompt',
  input: {schema: VisualQAndAInputSchema},
  output: {schema: VisualQAndAOutputSchema},
  prompt: `You are an AI assistant that answers questions and provides a visual representation of the answer.

  Question: {{{question}}}

  Answer: Provide a concise and informative answer to the question. Also, generate an image prompt that visually represents the answer. Enclose the image prompt in <image> tags. Example: <image>A cat sitting on a mat</image>
  `,
});

const visualQAndAFlow = ai.defineFlow(
  {
    name: 'visualQAndAFlow',
    inputSchema: VisualQAndAInputSchema,
    outputSchema: VisualQAndAOutputSchema,
  },
  async input => {
    const {output} = await visualQAndAPrompt(input);
    if (!output) {
      throw new Error('No output from visualQAndAPrompt');
    }

    const answer = output.answer;
    const imagePromptMatch = answer.match(/<image>(.*?)<\/image>/);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1] : 'a relevant image';

    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {
      answer: answer.replace(/<image>.*?<\/image>/g, '').trim(),
      imageUrl: media.url,
    };
  }
);
