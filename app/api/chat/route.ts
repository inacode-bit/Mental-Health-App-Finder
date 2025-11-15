import { NextResponse } from 'next/server';
import mentalHealthApps from '../../data/mentalHealthApps.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Simple keyword matching for now (no AI API needed)
    const lowerMessage = message.toLowerCase();
    
    // Find matching apps based on keywords
    let matchedApps = mentalHealthApps.apps.filter(app => {
      const searchText = `${app.name} ${app.description} ${app.conditions.join(' ')} ${app.features.join(' ')}`.toLowerCase();
      
      // Check for condition keywords
      if (lowerMessage.includes('anxiety') && searchText.includes('anxiety')) return true;
      if (lowerMessage.includes('depression') && searchText.includes('depression')) return true;
      if (lowerMessage.includes('sleep') && searchText.includes('sleep')) return true;
      if (lowerMessage.includes('stress') && searchText.includes('stress')) return true;
      if (lowerMessage.includes('meditation') && searchText.includes('meditation')) return true;
      if (lowerMessage.includes('therapy') && searchText.includes('therapy')) return true;
      if (lowerMessage.includes('free') && app.cost === 'free') return true;
      
      return false;
    });

    // Limit to top 3 recommendations
    matchedApps = matchedApps.slice(0, 3);

    // Create response
    let response = '';
    
    if (matchedApps.length > 0) {
      response = `I found ${matchedApps.length} app${matchedApps.length > 1 ? 's' : ''} that might help:\n\n`;
      
      matchedApps.forEach(app => {
        response += `**${app.name}**\n`;
        response += `${app.description}\n`;
        response += `• Platforms: ${app.platforms.join(', ')}\n`;
        response += `• Cost: ${app.price}\n`;
        response += `• Rating: ${app.rating}/5\n`;
        response += `• Learn more: ${app.url}\n\n`;
      });
      
      response += 'Would you like to know more about any of these apps, or search for something different?';
    } else {
      response = 'I couldn\'t find apps matching those specific criteria. Could you tell me more about what you\'re looking for? For example:\n\n• What condition would you like help with? (anxiety, depression, sleep, stress)\n• Do you prefer free or paid apps?\n• What platform do you use? (iOS, Android)';
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { response: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}