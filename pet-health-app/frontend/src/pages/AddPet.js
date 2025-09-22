import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaw, FaArrowLeft } from 'react-icons/fa';
import { usePets } from '../context/PetContext';

const AddPetContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  padding: 40px 0;
`;

const AddPetContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
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
  margin-bottom: 20px;
  padding: 8px 0;
  
  &:hover {
    color: #5a67d8;
  }
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const AddPet = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addPet, error } = usePets();
  const navigate = useNavigate();

  const { name, type, breed, age, weight, gender } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await addPet({
        name,
        type,
        breed: breed || undefined,
        age: age ? parseInt(age) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        gender: gender || undefined
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Add pet error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <AddPetContainer>
      <AddPetContent>
        <BackButton onClick={handleBack}>
          <FaArrowLeft />
          Back to Dashboard
        </BackButton>
        
        <Header>
          <Title>
            <FaPaw />
            Add New Pet
          </Title>
          <Subtitle>
            Tell us about your furry friend to get personalized health advice
          </Subtitle>
        </Header>

        <FormCard>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && (
            <SuccessMessage>
              Pet added successfully! Redirecting to dashboard...
            </SuccessMessage>
          )}

          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your pet's name"
                required
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label htmlFor="type">Pet Type *</Label>
                <Select
                  id="type"
                  name="type"
                  value={type}
                  onChange={onChange}
                  required
                >
                  <option value="">Select pet type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="breed">Breed</Label>
                <Input
                  type="text"
                  id="breed"
                  name="breed"
                  value={breed}
                  onChange={onChange}
                  placeholder="e.g., Golden Retriever, Persian"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  value={age}
                  onChange={onChange}
                  placeholder="Enter age in years"
                  min="0"
                  max="30"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  type="number"
                  id="weight"
                  name="weight"
                  value={weight}
                  onChange={onChange}
                  placeholder="Enter weight in kg"
                  min="0"
                  step="0.1"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="gender">Gender</Label>
              <Select
                id="gender"
                name="gender"
                value={gender}
                onChange={onChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </Select>
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Adding Pet...' : 'Add Pet'}
            </SubmitButton>
          </Form>
        </FormCard>
      </AddPetContent>
    </AddPetContainer>
  );
};

export default AddPet;
