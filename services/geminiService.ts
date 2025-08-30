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

const systemInstruction = `You are an expert CSS animation assistant. Based on the user's prompt, generate a JSON object representing the CSS properties for an animation. The JSON object must conform to the provided schema. The 'keyframes' string should contain a valid, creative, and interesting @keyframes rule that matches the animation.name. All duration and delay values should be numbers in seconds. Transform and filter values should be numbers. For example, for 'a button that shakes violently', the keyframes should define multiple steps (e.g., 0%, 25%, 50%, 75%, 100%) with different transform properties to create a shaking effect.`;

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