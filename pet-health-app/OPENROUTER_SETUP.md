# OpenRouter Integration Setup Guide

## Overview
The Pet Health Care application has been updated to use OpenRouter API instead of direct OpenAI API. This provides better flexibility, potentially better rate limits, and access to multiple AI models.

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key (starts with `sk-or-...`)

### 2. Update Environment Variables
1. Navigate to `pet-health-app/backend/`
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit the `.env` file and replace:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   with your actual OpenRouter API key:
   ```
   OPENROUTER_API_KEY=sk-or-your-actual-key-here
   ```

### 3. Current Configuration
The application is configured to use:
- **Model**: `openai/gpt-4o` (GPT-4 Omni via OpenRouter)
- **Max Tokens**: 500
- **Temperature**: 0.7
- **Referer**: `http://localhost:3001`
- **Title**: `PetHealth Care`

### 4. Available Models
You can change the model in `backend/routes/chat.js` line 134. Popular options include:
- `openai/gpt-4o` - GPT-4 Omni (recommended)
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `openai/gpt-3.5-turbo` - GPT-3.5 Turbo (cheaper)
- `anthropic/claude-3-sonnet` - Claude 3 Sonnet
- `anthropic/claude-3-haiku` - Claude 3 Haiku

### 5. Benefits of OpenRouter
- **Multiple Models**: Access to various AI models from different providers
- **Better Rate Limits**: Often more generous than direct API access
- **Cost Optimization**: Choose models based on cost/performance needs
- **Reliability**: Fallback options if one provider has issues
- **Unified API**: Single API for multiple AI providers

### 6. Testing the Integration
1. Start the backend server:
   ```bash
   cd pet-health-app/backend
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd pet-health-app/frontend
   npm start
   ```
3. Register/login to the application
4. Add a pet
5. Navigate to the chat interface
6. Send a health-related question about your pet
7. Verify you receive an AI response with risk assessment

### 7. Troubleshooting
- **API Key Issues**: Ensure your OpenRouter API key is valid and has sufficient credits
- **Model Errors**: Try switching to a different model if one is unavailable
- **Rate Limits**: OpenRouter typically has generous limits, but check your usage
- **Network Issues**: Ensure your server can reach `https://openrouter.ai/api/v1/chat/completions`

### 8. Cost Management
- Monitor your usage on the OpenRouter dashboard
- Consider using cheaper models like `gpt-3.5-turbo` for development
- Set up usage alerts in your OpenRouter account

## API Response Format
The OpenRouter API returns responses in the same format as OpenAI, so no changes were needed to the response parsing logic.

## Risk Assessment
The intelligent risk assessment system remains unchanged and continues to analyze AI responses for:
- 🔴 **Urgent**: Emergency situations requiring immediate vet care
- 🟠 **High**: Concerning symptoms needing vet attention
- 🟡 **Medium**: Symptoms to monitor
- 🟢 **Low**: General care advice

## Support
If you encounter issues with the OpenRouter integration, check:
1. OpenRouter API status page
2. Your API key validity
3. Account credits/usage limits
4. Network connectivity
