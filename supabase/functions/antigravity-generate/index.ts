/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = 'AIzaSyC3o8yR3GzoRO2z0I6glFBcsUGdAOtrJUw'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { prompt } = await req.json()

        // Example using Gemini API (or OpenAI)
        // Replace with actual API call

        if (!GEMINI_API_KEY) {
            throw new Error('Missing GEMINI_API_KEY')
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an expert coding assistant. Generate code for the following request: ${prompt}. Return a JSON object with "code" (string) and "explanation" (string).`
                    }]
                }]
            }),
        });

        const data = await response.json();

        // Parse Gemini response
        // Note: detailed parsing depends on the specific API response structure
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "// No code generated";

        // Quick and dirty JSON extraction from the text if the model returns markdown JSON
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        let parsedResult = { code: generatedText, explanation: "AI Generated" };

        if (jsonMatch) {
            try {
                parsedResult = JSON.parse(jsonMatch[0]);
            } catch (e) {
                // Fallback
            }
        }

        return new Response(
            JSON.stringify(parsedResult),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as any).message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    }
})
