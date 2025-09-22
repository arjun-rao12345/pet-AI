import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaPaw } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const RegisterTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const RegisterSubtitle = styled.p`
  color: #666;
  font-size: 14px;
`;

const RegisterForm = styled.form`
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

const RegisterButton = styled.button`
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

const RegisterFooter = styled.div`
  text-align: center;
  color: #666;
  font-size: 14px;
`;

const LoginLink = styled(Link)`
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

const PasswordRequirements = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: -15px;
  margin-bottom: 20px;
  padding-left: 45px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>
            <FaPaw />
            Join PetHealth Care
          </RegisterTitle>
          <RegisterSubtitle>Create your account to get started</RegisterSubtitle>
        </RegisterHeader>

        {(error || validationError) && (
          <ErrorMessage>{error || validationError}</ErrorMessage>
        )}

        <RegisterForm onSubmit={onSubmit}>
          <InputGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={onChange}
              required
            />
          </InputGroup>

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
              placeholder="Create a password"
              value={password}
              onChange={onChange}
              required
            />
          </InputGroup>
          <PasswordRequirements>
            Password must be at least 6 characters long
          </PasswordRequirements>

          <InputGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </InputGroup>

          <RegisterButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </RegisterButton>
        </RegisterForm>

        <RegisterFooter>
          Already have an account?{' '}
          <LoginLink to="/login">Sign in here</LoginLink>
        </RegisterFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
