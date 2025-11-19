import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, TenderAnalysis, PurchaseDomain, Sender } from "../types";
import { getDynamicTemplateConfig, getDynamicStandardClauses } from "./configManager";

// Initialize Gemini Client
// Note: In a real production app, you might proxy this through a backend.
// Since we are client-side only per instructions, we use the env var directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_CHAT = 'gemini-2.5-flash';
const MODEL_ANALYSIS = 'gemini-2.5-flash';

/**
 * Sends a message to the Gemini chat model to get a conversational response.
 */
export const sendChatMessage = async (
  history: Message[],
  newMessage: string
): Promise<string> => {
  try {
    // Convert internal message format to Gemini history format
    const chatHistory = history.map((msg) => ({
      role: msg.sender === Sender.User ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: MODEL_CHAT,
      history: chatHistory,
      config: {
        systemInstruction: `You are an expert Senior Procurement Officer helping a user define their tender requirements. 
        Your goal is to ask clarifying questions to understand:
        1. What they want to buy.
        2. The budget estimation (if known).
        3. Timeline.
        4. Specific technical requirements.
        
        Be helpful, professional, and concise. Do not generate the full tender document yet, just guide the conversation.`,
      },
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};

/**
 * Analyzes the conversation history to extract structured tender data.
 */
export const analyzeTenderRequirements = async (
  messages: Message[]
): Promise<TenderAnalysis> => {
  const conversationText = messages
    .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
    .join('\n');

  const prompt = `
    Analyze the following conversation between a user and a procurement assistant.
    Extract the key purchasing requirements, identify the industry domain, and recommend a tender template.
    
    Conversation Log:
    ${conversationText}
  `;

  const analysisSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      keyPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3-5 bullet points summarizing the specific requirements, items, or services needed.",
      },
      domain: {
        type: Type.STRING,
        enum: [
          "IT Services & Software",
          "Furniture & Fittings",
          "Logistics & Transport",
          "Medical Equipment",
          "Construction & Renovation",
          "General Goods",
          "Unspecified"
        ],
        description: "The industry category of the purchase.",
      },
      recommendedTemplate: {
        type: Type.STRING,
        description: "A specific name for a tender template (e.g., 'SaaS Implementation RFP', 'Office Supply Bulk Order').",
      },
      reasoning: {
        type: Type.STRING,
        description: "A short sentence explaining why this domain and template were chosen.",
      },
    },
    required: ["keyPoints", "domain", "recommendedTemplate", "reasoning"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ANALYSIS,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from analysis");
    
    const analysisData = JSON.parse(text) as TenderAnalysis;

    // Inject default structure based on identified domain
    // This allows the UI to show the editable structure immediately
    const config = getDynamicTemplateConfig(analysisData.domain);
    analysisData.structure = config.sections;

    return analysisData;
  } catch (error) {
    console.error("Analysis Error:", error);
    // Fallback return to avoid crashing UI
    return {
      keyPoints: ["Unable to analyze text at this moment."],
      domain: PurchaseDomain.Unspecified,
      recommendedTemplate: "General Request for Proposal",
      reasoning: "Analysis service unavailable.",
      structure: ["1. Project Overview", "2. Scope of Work", "3. Pricing"]
    };
  }
};

/**
 * Generates a draft tender document structure based on the analysis.
 */
export const generateTenderDraft = async (
  analysis: TenderAnalysis, 
  customStructure?: string[]
): Promise<string> => {
    const templateConfig = getDynamicTemplateConfig(analysis.domain);
    const standardClauses = getDynamicStandardClauses(analysis.domain);
    
    // Use custom structure if provided, otherwise fallback to analysis structure, then config default
    const structureToUse = customStructure || analysis.structure || templateConfig.sections;

    let clausesPrompt = "";
    if (standardClauses.length > 0) {
        const formattedClauses = standardClauses
          .map(c => `--- CLAUSE TITLE: "${c.title}" ---\nCONTENT:\n${c.content}\n--- END CLAUSE ---`)
          .join('\n\n');
        
        clausesPrompt = `
      CRITICAL INSTRUCTION - STANDARD CLAUSE INSERTION:
      You have access to a library of MANDATORY Standard Clauses below.
      
      Your task is to map these clauses to the "DOCUMENT STRUCTURE" provided above.
      
      RULES:
      1.  **Direct Mapping:** If a section in the Document Structure resembles a Clause Title (e.g., Section "Security" matches Clause "Standard Security Requirements"), you MUST fill that section with the content of that clause.
      2.  **Preserve Content:** Insert the clause content EXACTLY as written. Do not summarize, shorten, or rewrite the requirements. 
      3.  **Fix Numbering:** The only allowed change to the clause content is re-numbering the sub-points to match the document's hierarchy (e.g., changing "1.1" to "3.1" if it falls under Section 3).
      4.  **Integration:** If a clause covers a topic not explicitly listed in the structure, integrate it into the most relevant section.

      STANDARD CLAUSES LIBRARY:
      ${formattedClauses}
        `;
    }

    const prompt = `
      You are a professional Tender Writer. Create a comprehensive Tender/RFP document in Markdown format.
      
      Context:
      - Domain: ${analysis.domain}
      - Recommended Template: ${analysis.recommendedTemplate}
      - User Requirements: 
      ${analysis.keyPoints.map(p => `- ${p}`).join('\n')}

      DOCUMENT STRUCTURE (Strictly Follow):
      ${structureToUse.map(s => `- ${s}`).join('\n')}

      ${clausesPrompt}

      CONTENT GUIDELINES:
      - Focus Area: ${templateConfig.focusArea}
      - Ensure these compliance keywords/standards are mentioned where relevant: ${templateConfig.complianceKeywords.join(', ')}.
      - Fill in the sections with professional placeholder text or specific content based on the User Requirements provided above.
      - Use clear headings (##) and bullet points.
      
      Generate the full document now.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_CHAT,
            contents: prompt
        });
        return response.text || "# Error generating draft";
    } catch (e) {
        return "# Error generating draft";
    }
}
