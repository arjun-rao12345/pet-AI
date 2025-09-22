import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaw, FaComments, FaShieldAlt, FaUserMd } from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled(Link)`
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &.primary {
    background: white;
    color: #667eea;
  }
  
  &.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }
  
  &.secondary:hover {
    background: white;
    color: #667eea;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: #f8f9fa;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: #333;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <FaPaw style={{ marginRight: '15px' }} />
            Pet Health Care AI
          </HeroTitle>
          <HeroSubtitle>
            Get instant, professional health advice for your beloved pets with our AI-powered chatbot. 
            Monitor their health, assess risks, and know when to visit the vet.
          </HeroSubtitle>
          <CTAButtons>
            <CTAButton to="/register" className="primary">
              Get Started Free
            </CTAButton>
            <CTAButton to="/login" className="secondary">
              Sign In
            </CTAButton>
          </CTAButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose PetHealth Care?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FaComments />
              </FeatureIcon>
              <FeatureTitle>AI-Powered Chat</FeatureTitle>
              <FeatureDescription>
                Get instant answers to your pet health questions with our advanced AI chatbot 
                trained on veterinary knowledge and best practices.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaShieldAlt />
              </FeatureIcon>
              <FeatureTitle>Risk Assessment</FeatureTitle>
              <FeatureDescription>
                Our system evaluates symptoms and provides risk levels (Low, Medium, High, Urgent) 
                to help you make informed decisions about your pet's care.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaUserMd />
              </FeatureIcon>
              <FeatureTitle>Vet Recommendations</FeatureTitle>
              <FeatureDescription>
                Receive clear guidance on when to seek professional veterinary care, 
                ensuring your pet gets the right treatment at the right time.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;
