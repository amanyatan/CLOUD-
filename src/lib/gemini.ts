import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
    console.warn('Missing Gemini API Key')
}

const genAI = new GoogleGenerativeAI(apiKey || '')

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export const generateContent = async (prompt: string) => {
    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Error generating content:', error)
        throw error
    }
}
