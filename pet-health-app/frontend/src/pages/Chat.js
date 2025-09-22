import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaw, FaArrowLeft, FaPaperPlane, FaRobot, FaUser, FaExclamationTriangle, FaImage, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { usePets } from '../context/PetContext';

const ChatContainer = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
`;

const ChatHeader = styled.div`
  background: white;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #667eea;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const PetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PetAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const PetDetails = styled.div``;

const PetName = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.5rem;
`;

const PetType = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 70%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  
  ${props => props.isUser ? `
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  ` : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  `}
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? '#667eea' : 'white'};
  color: ${props => props.isUser ? 'white' : '#333'};
  padding: 15px 20px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  
  ${props => props.isUser ? `
    border-bottom-right-radius: 6px;
  ` : `
    border-bottom-left-radius: 6px;
  `}
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.8;
`;

const RiskBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.level) {
      case 'low':
        return 'background: #d4edda; color: #155724;';
      case 'medium':
        return 'background: #fff3cd; color: #856404;';
      case 'high':
        return 'background: #f8d7da; color: #721c24;';
      case 'urgent':
        return 'background: #f5c6cb; color: #721c24; animation: pulse 2s infinite;';
      default:
        return 'background: #e9ecef; color: #6c757d;';
    }
  }}
`;

const VetRecommendation = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #856404;
`;

const InputContainer = styled.div`
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 20px;
`;

const InputForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 70%;
  align-self: flex-start;
`;

const LoadingContent = styled.div`
  background: white;
  padding: 15px 20px;
  border-radius: 18px;
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  
  span {
    width: 6px;
    height: 6px;
    background: #667eea;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    } 40% {
      transform: scale(1);
    }
  }
`;

const ImageButton = styled.button`
  background: transparent;
  border: 2px solid #e9ecef;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #667eea;
    background-color: #f8f9fa;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  display: inline-block;
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 150px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  &:hover {
    background: #c82333;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const MessageImage = styled.img`
  max-width: 250px;
  max-height: 200px;
  border-radius: 12px;
  margin-top: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageAnalysisNote = styled.div`
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 10px;
  margin-top: 8px;
  font-size: 12px;
  color: #1565c0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Chat = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { pets } = usePets();
  const [currentPet, setCurrentPet] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState('default');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadChatHistory = useCallback(async () => {
    try {
      const response = await axios.get(`https://pet-ai-chbi.onrender.com/api/chat/history/${petId}`, {
        params: { sessionId }
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [petId, sessionId]);

  useEffect(() => {
    // Find current pet
    const pet = pets.find(p => p._id === petId);
    if (pet) {
      setCurrentPet(pet);
      loadChatHistory();
    }
  }, [petId, pets, loadChatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://pet-ai-chbi.onrender.com/api/chat/message', {
        message: inputMessage.trim(),
        petId,
        sessionId
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        riskLevel: response.data.riskLevel,
        vetRecommendation: response.data.vetRecommendation
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        riskLevel: 'low',
        vetRecommendation: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedImage) {
        sendMessageWithImage(e);
      } else {
        sendMessage(e);
      }
    }
  };

  // Image handling functions
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Image size should be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessageWithImage = async (e) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim() || 'Image uploaded for analysis',
      timestamp: new Date(),
      hasImage: !!selectedImage
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    const imageFile = selectedImage;
    
    setInputMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setLoading(true);

    try {
      let response;
      
      if (imageFile) {
        // Send message with image
        const formData = new FormData();
        formData.append('message', messageText || 'Please analyze this image of my pet for any health concerns, skin conditions, or wounds.');
        formData.append('petId', petId);
        formData.append('sessionId', sessionId);
        formData.append('image', imageFile);

        response = await axios.post('https://pet-ai-chbi.onrender.com/api/chat/message-with-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Send text-only message
        response = await axios.post('https://pet-ai-chbi.onrender.com/api/chat/message', {
          message: messageText,
          petId,
          sessionId
        });
      }

      const aiMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        riskLevel: response.data.riskLevel,
        vetRecommendation: response.data.vetRecommendation,
        imageAnalysis: !!imageFile
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date(),
        riskLevel: 'low',
        vetRecommendation: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPet) {
    return (
      <ChatContainer>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading pet information...</p>
        </div>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderContent>
          <BackButton onClick={() => navigate('/dashboard')}>
            <FaArrowLeft />
            Back
          </BackButton>
          <PetInfo>
            <PetAvatar>
              <FaPaw />
            </PetAvatar>
            <PetDetails>
              <PetName>Chat with {currentPet.name}</PetName>
              <PetType>
                {currentPet.type} • {currentPet.breed || 'Mixed breed'} • {currentPet.age ? `${currentPet.age} years old` : 'Age unknown'}
              </PetType>
            </PetDetails>
          </PetInfo>
        </HeaderContent>
      </ChatHeader>

      <ChatBody>
        <MessagesContainer>
          {messages.length === 0 && (
            <Message isUser={false}>
              <MessageAvatar>
                <FaRobot />
              </MessageAvatar>
              <MessageContent>
                <MessageText>
                  Hello! I'm your AI veterinary assistant with image analysis capabilities. I'm here to help you with questions about {currentPet.name}'s health. 
                  
                  You can:
                  • Ask questions about symptoms or health concerns
                  • Upload images of skin conditions, wounds, or other visible issues for analysis
                  • Get risk assessments and veterinary recommendations
                  
                  Remember: I can provide guidance and advice, but for serious concerns or emergencies, always consult with a licensed veterinarian.
                </MessageText>
              </MessageContent>
            </Message>
          )}
          
          {messages.map((message, index) => (
            <Message key={index} isUser={message.role === 'user'}>
              <MessageAvatar isUser={message.role === 'user'}>
                {message.role === 'user' ? <FaUser /> : <FaRobot />}
              </MessageAvatar>
              <MessageContent isUser={message.role === 'user'}>
                <MessageText>{message.content}</MessageText>
                {message.role === 'assistant' && (
                  <MessageMeta>
                    {message.riskLevel && (
                      <RiskBadge level={message.riskLevel}>
                        {message.riskLevel} risk
                      </RiskBadge>
                    )}
                    {message.vetRecommendation && (
                      <VetRecommendation>
                        <FaExclamationTriangle />
                        Consider consulting a veterinarian
                      </VetRecommendation>
                    )}
                  </MessageMeta>
                )}
              </MessageContent>
            </Message>
          ))}
          
          {loading && (
            <LoadingMessage>
              <MessageAvatar>
                <FaRobot />
              </MessageAvatar>
              <LoadingContent>
                <span>AI is thinking</span>
                <LoadingDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </LoadingDots>
              </LoadingContent>
            </LoadingMessage>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          {imagePreview && (
            <ImagePreviewContainer>
              <ImagePreview src={imagePreview} alt="Selected image" />
              <RemoveImageButton onClick={removeImage}>
                <FaTimes />
              </RemoveImageButton>
            </ImagePreviewContainer>
          )}
          
          <InputForm onSubmit={selectedImage ? sendMessageWithImage : sendMessage}>
            <MessageInput
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={selectedImage ? 
                `Describe what you see or ask about ${currentPet.name}'s condition...` : 
                `Ask about ${currentPet.name}'s health or upload an image...`
              }
              disabled={loading}
              rows={1}
            />
            
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
            
            <ImageButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Upload image for analysis"
            >
              <FaImage />
            </ImageButton>
            
            <SendButton 
              type="submit" 
              disabled={loading || (!inputMessage.trim() && !selectedImage)}
              title={selectedImage ? "Send message with image" : "Send message"}
            >
              <FaPaperPlane />
            </SendButton>
          </InputForm>
        </InputContainer>
      </ChatBody>
    </ChatContainer>
  );
};

export default Chat;
