import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiResponse } from '../types';
import { 
    DEFAULT_STYLE_STATE, 
    DEFAULT_ANIMATION_STATE,
    TIMING_FUNCTIONS,
    DIRECTIONS,
    FILL_MODES
} from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        styles: {
            type: Type.OBJECT,
            properties: {
                transform: {
                    type: Type.OBJECT,
                    properties: {
                        translateX: { type: Type.NUMBER },
                        translateY: { type: Type.NUMBER },
                        scale: { type: Type.NUMBER },
                        rotate: { type: Type.NUMBER },
                        skewX: { type: Type.NUMBER },
                        skewY: { type: Type.NUMBER }
                    }
                },
                filter: {
                    type: Type.OBJECT,
                    properties: {
                        blur: { type: Type.NUMBER },
                        brightness: { type: Type.NUMBER },
                        contrast: { type: Type.NUMBER },
                        grayscale: { type: Type.NUMBER },
                        hueRotate: { type: Type.NUMBER },
                        saturate: { type: Type.NUMBER },
                        sepia: { type: Type.NUMBER }
                    }
                },
                other: {
                    type: Type.OBJECT,
                    properties: {
                        backgroundColor: { type: Type.STRING },
                        borderRadius: { type: Type.NUMBER },
                        opacity: { type: Type.NUMBER }
                    }
                }
            }
        },
        animation: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                duration: { type: Type.NUMBER },
                timingFunction: { type: Type.STRING },
                delay: { type: Type.NUMBER },
                iterationCount: { type: Type.STRING },
                direction: { type: Type.STRING },
                fillMode: { type: Type.STRING }
            }
        },
        keyframes: { type: Type.STRING }
    }
};

const systemInstruction = `You are an expert CSS animation assistant. Your goal is to generate a JSON object that defines a CSS animation based on the user's prompt. The JSON object must conform to the provided schema.

IMPORTANT CONTEXT: The animation you define will be applied to a SINGLE HTML element on the page.

Your primary task is to be creative and generate complex, interesting, and high-quality keyframe animations.

- **Interpret Prompts Creatively:** If a prompt implies multiple objects (e.g., "particles colliding," "a school of fish," "fireworks"), you must translate that concept into an animation for a SINGLE element. For example:
    - For "particles colliding inside a container," create keyframes for ONE element that moves erratically and appears to bounce off invisible walls. Use \`transform: translate(x, y);\` to define its path.
    - For "fireworks," create keyframes for one element that moves up, then 'explodes' by rapidly scaling up and fading out.
- **Use Detailed Keyframes:** Do not just use \`from\` and \`to\`. Use multiple percentage steps (e.g., \`0%\`, \`15%\`, \`40%\`, \`65%\`, \`80%\`, \`100%\`) to create more fluid and detailed motion. The \`keyframes\` string is the most important part of your output.
- **Match Animation Properties:** The \`animation\` properties you define (like \`duration\`, \`timingFunction\`, etc.) should complement the \`keyframes\` you write.
- **Example Task:** If the prompt is "a nervous bouncing ball that's losing energy," you might set a longer duration, use an \`ease-in-out\` timing function, and create keyframes where the \`translateY\` bounce height decreases over the course of the animation.
- **Stay within the Schema:** Ensure your entire output is a single, valid JSON object that strictly follows the schema. The 'keyframes' value must be a string containing a valid CSS @keyframes rule.`;

export const generateAnimation = async (prompt: string): Promise<GeminiResponse | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        let jsonText = response.text.trim();
        
        // The model might return the JSON inside a markdown code block.
        const match = jsonText.match(/```(json)?\s*([\s\S]*?)\s*```/);
        if (match) {
            jsonText = match[2];
        }

        const parsedJson = JSON.parse(jsonText);

        // Merge with defaults for robustness against incomplete AI responses
        const result: GeminiResponse = {
            styles: {
                transform: { 
                    ...DEFAULT_STYLE_STATE.transform, 
                    ...(parsedJson.styles?.transform || {}) 
                },
                filter: { 
                    ...DEFAULT_STYLE_STATE.filter, 
                    ...(parsedJson.styles?.filter || {}) 
                },
                other: { 
                    ...DEFAULT_STYLE_STATE.other, 
                    ...(parsedJson.styles?.other || {}) 
                },
            },
            animation: { 
                ...DEFAULT_ANIMATION_STATE, 
                ...(parsedJson.animation || {})
            },
            keyframes: parsedJson.keyframes || '',
        };

        // Validate that the most essential fields are present
        if (result.animation.name && result.keyframes) {
            // Sanitize enum-like properties to prevent UI breakage from unexpected values
            if (!(TIMING_FUNCTIONS as ReadonlyArray<string>).includes(result.animation.timingFunction)) {
                result.animation.timingFunction = 'linear';
            }
            if (!(DIRECTIONS as ReadonlyArray<string>).includes(result.animation.direction)) {
                result.animation.direction = 'normal';
            }
            if (!(FILL_MODES as ReadonlyArray<string>).includes(result.animation.fillMode)) {
                result.animation.fillMode = 'none';
            }
            return result;
        }
        
        console.error("Parsed JSON from AI does not contain essential animation name or keyframes:", parsedJson);
        return null;

    } catch (error) {
        console.error("Error generating or parsing animation from Gemini:", error);
        if (error instanceof SyntaxError) { // JSON parsing error
            throw new Error("Failed to parse the response from the AI. The format might be invalid.");
        }
        throw new Error("An error occurred while communicating with the AI. Please try again.");
    }
};