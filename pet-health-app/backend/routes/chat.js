const express = require('express');
const OpenAI = require('openai');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Chat = require('../models/Chat');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet-image-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Function to convert image to base64
const imageToBase64 = async (imagePath) => {
  try {
    const imageBuffer = await sharp(imagePath)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// OpenRouter API configuration using OpenAI SDK
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3001',
    'X-Title': 'PetHealth Care',
  },
});

// Risk assessment function
const assessRisk = (response) => {
  const lowerResponse = response.toLowerCase();
  
  // Urgent keywords
  const urgentKeywords = [
    'emergency', 'urgent', 'immediately', 'critical', 'severe', 'poisoning',
    'bleeding', 'unconscious', 'seizure', 'difficulty breathing', 'choking',
    'trauma', 'accident', 'collapse', 'paralysis', 'bloat', 'torsion'
  ];
  
  // High risk keywords
  const highRiskKeywords = [
    'veterinarian', 'vet visit', 'medical attention', 'concerning', 'worrying',
    'infection', 'fever', 'vomiting', 'diarrhea', 'lethargy', 'pain',
    'swelling', 'limping', 'loss of appetite', 'dehydration'
  ];
  
  // Medium risk keywords
  const mediumRiskKeywords = [
    'monitor', 'watch', 'observe', 'mild', 'slight', 'minor',
    'keep an eye', 'check', 'follow up', 'improvement'
  ];
  
  // Check for urgent conditions
  if (urgentKeywords.some(keyword => lowerResponse.includes(keyword))) {
    return { level: 'urgent', vetRecommendation: true };
  }
  
  // Check for high risk conditions
  if (highRiskKeywords.some(keyword => lowerResponse.includes(keyword))) {
    return { level: 'high', vetRecommendation: true };
  }
  
  // Check for medium risk conditions
  if (mediumRiskKeywords.some(keyword => lowerResponse.includes(keyword))) {
    return { level: 'medium', vetRecommendation: false };
  }
  
  // Default to low risk
  return { level: 'low', vetRecommendation: false };
};

// Enhanced risk assessment for image analysis
const assessRiskWithImage = (response, hasImage) => {
  const lowerResponse = response.toLowerCase();
  
  // Image-specific urgent keywords
  const imageUrgentKeywords = [
    'severe wound', 'deep cut', 'heavy bleeding', 'infected wound', 'pus', 'necrotic',
    'emergency', 'urgent', 'immediately', 'critical', 'severe infection'
  ];
  
  // Image-specific high risk keywords
  const imageHighRiskKeywords = [
    'infection', 'swollen', 'discharge', 'red and inflamed', 'hot to touch',
    'spreading', 'worsening', 'veterinarian needed', 'concerning appearance'
  ];
  
  // Image-specific medium risk keywords
  const imageMediumRiskKeywords = [
    'minor wound', 'superficial', 'healing', 'monitor closely', 'keep clean',
    'mild inflammation', 'small scratch'
  ];
  
  if (hasImage) {
    // More sensitive assessment when image is provided
    if (imageUrgentKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return { level: 'urgent', vetRecommendation: true };
    }
    
    if (imageHighRiskKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return { level: 'high', vetRecommendation: true };
    }
    
    if (imageMediumRiskKeywords.some(keyword => lowerResponse.includes(keyword))) {
      return { level: 'medium', vetRecommendation: false };
    }
  }
  
  // Fall back to regular assessment
  return assessRisk(response);
};

// Send message with image to chat
router.post('/message-with-image', auth, upload.single('image'), async (req, res) => {
  try {
    const { message, petId, sessionId } = req.body;
    const imageFile = req.file;

    if (!message || !petId) {
      return res.status(400).json({ message: 'Message and pet ID are required' });
    }

    console.log('Processing chat message with image:', { 
      userId: req.user._id, 
      petId, 
      messageLength: message.length,
      hasImage: !!imageFile
    });

    // Get pet information
    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Find or create chat session
    let chat = await Chat.findOne({ 
      user: req.user._id, 
      pet: petId, 
      sessionId: sessionId || 'default',
      isActive: true 
    });

    if (!chat) {
      chat = new Chat({
        user: req.user._id,
        pet: petId,
        sessionId: sessionId || 'default',
        messages: []
      });
    }

    // Prepare user message with image
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // Add image information if provided
    if (imageFile) {
      userMessage.image = {
        filename: imageFile.filename,
        originalName: imageFile.originalname,
        mimetype: imageFile.mimetype,
        size: imageFile.size,
        path: imageFile.path
      };
    }

    chat.messages.push(userMessage);

    // Prepare context for AI
    const petContext = `Pet Information:
- Name: ${pet.name}
- Type: ${pet.type}
- Breed: ${pet.breed || 'Not specified'}
- Age: ${pet.age || 'Not specified'} years old
- Weight: ${pet.weight || 'Not specified'} kg
- Gender: ${pet.gender || 'Not specified'}
- Medical History: ${pet.medicalHistory.length > 0 ? 
  pet.medicalHistory.map(h => `${h.condition} (${h.date})`).join(', ') : 
  'No previous medical history'}`;

    const systemPrompt = `You are a professional veterinary assistant AI with image analysis capabilities, helping pet owners with health-related questions about their pets.

${petContext}

IMPORTANT PET TYPE VALIDATION:
- You are specifically helping with questions about ${pet.name}, who is a ${pet.type.toLowerCase()}
- ONLY answer questions related to ${pet.type.toLowerCase()}s
- If the user asks about a different animal type, politely redirect them

IMAGE ANALYSIS CAPABILITIES:
- When provided with images, analyze them for visible health concerns
- Look for skin conditions, wounds, swelling, discharge, abnormal growths, or other visible symptoms
- Provide detailed observations about what you see in the image
- Correlate image findings with the pet's symptoms described in text
- Be specific about locations, colors, sizes, and characteristics of any abnormalities

SKIN DISEASE & WOUND ANALYSIS:
- Identify potential skin conditions: dermatitis, hot spots, fungal infections, allergic reactions
- Assess wound severity: superficial scratches, deep cuts, infected wounds, healing progress
- Note signs of infection: redness, swelling, discharge, heat
- Evaluate urgency based on visual appearance

Guidelines for ${pet.type.toLowerCase()} health questions with images:
1. Provide detailed analysis of visible symptoms in the image
2. Correlate image findings with text description
3. Assess severity and urgency based on visual evidence
4. Recommend appropriate care level (home care, vet visit, emergency)
5. Always emphasize that images cannot replace physical examination
6. Be specific about when immediate veterinary attention is needed

Important: If the image shows severe wounds, signs of serious infection, or emergency conditions, immediately recommend urgent veterinary care.

Respond professionally with detailed image analysis for ${pet.name} the ${pet.type.toLowerCase()}.`;

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent chat history
    const recentMessages = chat.messages.slice(-10);
    for (const msg of recentMessages) {
      if (msg.role === 'user') {
        if (msg.image && fs.existsSync(msg.image.path)) {
          // Convert image to base64 for AI analysis
          const base64Image = await imageToBase64(msg.image.path);
          messages.push({
            role: 'user',
            content: [
              { type: 'text', text: msg.content },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                } 
              }
            ]
          });
        } else {
          messages.push({
            role: 'user',
            content: msg.content
          });
        }
      } else {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // Get response from OpenRouter using OpenAI SDK with vision
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: messages,
      max_tokens: 700,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Enhanced risk assessment for image analysis
    const riskAssessment = assessRiskWithImage(aiResponse, !!imageFile);

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      riskLevel: riskAssessment.level,
      vetRecommendation: riskAssessment.vetRecommendation
    });

    await chat.save();

    res.json({
      message: aiResponse,
      riskLevel: riskAssessment.level,
      vetRecommendation: riskAssessment.vetRecommendation,
      chatId: chat._id,
      sessionId: chat.sessionId,
      imageUploaded: !!imageFile,
      imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null
    });

  } catch (error) {
    console.error('Chat with image error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error processing your message with image. Please try again.',
      error: error.message
    });
  }
});

// Send message to chat (text only)
router.post('/message', auth, async (req, res) => {
  try {
    const { message, petId, sessionId } = req.body;

    if (!message || !petId) {
      return res.status(400).json({ message: 'Message and pet ID are required' });
    }

    console.log('Processing chat message:', { 
      userId: req.user._id, 
      petId, 
      messageLength: message.length
    });

    // Get pet information
    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Find or create chat session
    let chat = await Chat.findOne({ 
      user: req.user._id, 
      pet: petId, 
      sessionId: sessionId || 'default',
      isActive: true 
    });

    if (!chat) {
      chat = new Chat({
        user: req.user._id,
        pet: petId,
        sessionId: sessionId || 'default',
        messages: []
      });
    }

    // Add user message to chat
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Prepare context for AI
    const petContext = `Pet Information:
- Name: ${pet.name}
- Type: ${pet.type}
- Breed: ${pet.breed || 'Not specified'}
- Age: ${pet.age || 'Not specified'} years old
- Weight: ${pet.weight || 'Not specified'} kg
- Gender: ${pet.gender || 'Not specified'}
- Medical History: ${pet.medicalHistory.length > 0 ? 
  pet.medicalHistory.map(h => `${h.condition} (${h.date})`).join(', ') : 
  'No previous medical history'}`;

    const systemPrompt = `You are a professional veterinary assistant AI helping pet owners with health-related questions about their pets. 

${petContext}

IMPORTANT PET TYPE VALIDATION:
- You are specifically helping with questions about ${pet.name}, who is a ${pet.type.toLowerCase()}
- ONLY answer questions related to ${pet.type.toLowerCase()}s
- If the user asks about a different animal type (e.g., asking about dogs when the pet is a cat, or vice versa), politely redirect them
- For questions about other animals, respond: "I notice you're asking about [other animal type], but I'm currently helping you with ${pet.name}, who is a ${pet.type.toLowerCase()}. If you have questions about a different pet, please add that pet to your account or switch to the correct pet profile to get accurate, species-specific advice."

Guidelines for ${pet.type.toLowerCase()} health questions:
1. Provide helpful, accurate information specific to ${pet.type.toLowerCase()} health
2. Always emphasize that you cannot replace professional veterinary care
3. For serious symptoms, recommend immediate veterinary attention
4. Use clear, compassionate language
5. Ask follow-up questions when needed for better assessment of ${pet.name}
6. Provide practical care tips appropriate for ${pet.type.toLowerCase()}s
7. Be specific about when to seek emergency care for ${pet.type.toLowerCase()}s

Species-Specific Focus:
- All advice should be tailored specifically for ${pet.type.toLowerCase()}s
- Consider ${pet.type.toLowerCase()}-specific anatomy, behavior, and health concerns
- Reference ${pet.name} by name to personalize responses
- If breed is specified (${pet.breed || 'mixed breed'}), consider breed-specific health considerations

Important: If ${pet.name} shows signs of emergency (difficulty breathing, seizures, severe bleeding, unconsciousness, poisoning, etc.), immediately recommend urgent veterinary care.

Respond professionally and helpfully to the pet owner's question about ${pet.name} the ${pet.type.toLowerCase()}.`;

    // Prepare messages for AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chat.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Get response from OpenRouter using OpenAI SDK
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    // Assess risk level
    const riskAssessment = assessRisk(aiResponse);

    // Add AI response to chat
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
      riskLevel: riskAssessment.level,
      vetRecommendation: riskAssessment.vetRecommendation
    });

    await chat.save();

    res.json({
      message: aiResponse,
      riskLevel: riskAssessment.level,
      vetRecommendation: riskAssessment.vetRecommendation,
      chatId: chat._id,
      sessionId: chat.sessionId
    });

  } catch (error) {
    console.error('Chat error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    // More specific error messages
    if (error.response?.status === 401) {
      res.status(500).json({ 
        message: 'API authentication failed. Please check OpenRouter API key configuration.',
        error: 'Authentication Error'
      });
    } else if (error.response?.status === 429) {
      res.status(500).json({ 
        message: 'API rate limit exceeded. Please try again later.',
        error: 'Rate Limit Error'
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      res.status(500).json({ 
        message: 'Unable to connect to AI service. Please check your internet connection.',
        error: 'Connection Error'
      });
    } else {
      res.status(500).json({ 
        message: 'Error processing your message. Please try again.',
        error: error.message
      });
    }
  }
});

// Get chat history
router.get('/history/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const { sessionId } = req.query;

    const chat = await Chat.findOne({
      user: req.user._id,
      pet: petId,
      sessionId: sessionId || 'default'
    }).populate('pet', 'name type breed');

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chat.messages,
      pet: chat.pet,
      sessionId: chat.sessionId
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Get all chat sessions for a pet
router.get('/sessions/:petId', auth, async (req, res) => {
  try {
    const { petId } = req.params;

    const sessions = await Chat.find({
      user: req.user._id,
      pet: petId
    }).select('sessionId createdAt messages').sort({ createdAt: -1 });

    const sessionSummary = sessions.map(session => ({
      sessionId: session.sessionId,
      createdAt: session.createdAt,
      messageCount: session.messages.length,
      lastMessage: session.messages.length > 0 ? 
        session.messages[session.messages.length - 1].content.substring(0, 100) + '...' : 
        'No messages'
    }));

    res.json(sessionSummary);

  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ message: 'Error fetching chat sessions' });
  }
});

// Start new chat session
router.post('/new-session', auth, async (req, res) => {
  try {
    const { petId } = req.body;

    if (!petId) {
      return res.status(400).json({ message: 'Pet ID is required' });
    }

    // Verify pet ownership
    const pet = await Pet.findOne({ _id: petId, owner: req.user._id });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Generate new session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      sessionId,
      message: 'New chat session created successfully'
    });

  } catch (error) {
    console.error('New session error:', error);
    res.status(500).json({ message: 'Error creating new session' });
  }
});

module.exports = router;
