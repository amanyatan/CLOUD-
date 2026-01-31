import { supabase } from './supabase'

export interface AIResponse {
    code: string;
    explanation: string;
}

export async function generateCode(prompt: string): Promise<AIResponse> {
    // This calls the 'antigravity-generate' Edge Function
    // You must deploy this function to Supabase
    const { data, error } = await supabase.functions.invoke('antigravity-generate', {
        body: { prompt },
    })

    if (error) {
        console.error('AI Generation Error:', error)
        throw new Error('Failed to generate code. Please try again.')
    }

    return data
}
