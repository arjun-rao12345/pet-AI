import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaPaw } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LoginTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const LoginSubtitle = styled.p`
  color: #666;
  font-size: 14px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginFooter = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const SignupLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login({ email, password });
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>
            <FaPaw />
            Welcome Back
          </LoginTitle>
          <LoginSubtitle>Sign in to your PetHealth Care account</LoginSubtitle>
        </LoginHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <LoginForm onSubmit={onSubmit}>
          <InputGroup>
            <InputIcon>
              <FaEnvelope />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={onChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
            />
          </InputGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </LoginButton>
        </LoginForm>

        <LoginFooter>
          Don't have an account?{' '}
          <SignupLink to="/register">Sign up here</SignupLink>
        </LoginFooter>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
