import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPaw, FaArrowLeft, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { usePets } from '../context/PetContext';

const ProfileContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  padding: 40px 0;
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
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

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
  position: relative;
`;

const EditButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const PetAvatar = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 3rem;
`;

const PetName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
`;

const PetType = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProfileBody = styled.div`
  padding: 40px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #666;
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: #333;
`;

const EditForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.primary:hover {
    transform: translateY(-2px);
  }
  
  &.secondary {
    background: #6c757d;
    color: white;
  }
  
  &.secondary:hover {
    background: #5a6268;
  }
  
  &:disabled {
    opacity: 0.6;
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

const PetProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, updatePet, error } = usePets();
  const [currentPet, setCurrentPet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    gender: ''
  });

  useEffect(() => {
    const pet = pets.find(p => p._id === id);
    if (pet) {
      setCurrentPet(pet);
      setFormData({
        name: pet.name || '',
        type: pet.type || '',
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        gender: pet.gender || ''
      });
    }
  }, [id, pets]);

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentPet) {
      setFormData({
        name: currentPet.name || '',
        type: currentPet.type || '',
        breed: currentPet.breed || '',
        age: currentPet.age || '',
        weight: currentPet.weight || '',
        gender: currentPet.gender || ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePet(id, {
        name: formData.name,
        type: formData.type,
        breed: formData.breed || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        gender: formData.gender || undefined
      });
      
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Update pet error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPet) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading pet profile...</p>
          </div>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <BackButton onClick={() => navigate('/dashboard')}>
          <FaArrowLeft />
          Back to Dashboard
        </BackButton>

        <ProfileCard>
          <ProfileHeader>
            {!isEditing && (
              <EditButton onClick={handleEdit}>
                <FaEdit />
              </EditButton>
            )}
            <PetAvatar>
              <FaPaw />
            </PetAvatar>
            <PetName>{currentPet.name}</PetName>
            <PetType>{currentPet.type}</PetType>
          </ProfileHeader>

          <ProfileBody>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && (
              <SuccessMessage>
                Pet profile updated successfully!
              </SuccessMessage>
            )}

            {isEditing ? (
              <EditForm onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Pet Type *</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
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
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="e.g., Golden Retriever, Persian"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
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
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </FormGroup>

                <ButtonGroup style={{ gridColumn: '1 / -1' }}>
                  <Button type="button" className="secondary" onClick={handleCancel}>
                    <FaTimes />
                    Cancel
                  </Button>
                  <Button type="submit" className="primary" disabled={loading}>
                    <FaSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </ButtonGroup>
              </EditForm>
            ) : (
              <InfoGrid>
                <InfoSection>
                  <SectionTitle>Basic Information</SectionTitle>
                  <InfoItem>
                    <InfoLabel>Name</InfoLabel>
                    <InfoValue>{currentPet.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Type</InfoLabel>
                    <InfoValue style={{ textTransform: 'capitalize' }}>
                      {currentPet.type}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Breed</InfoLabel>
                    <InfoValue>{currentPet.breed || 'Not specified'}</InfoValue>
                  </InfoItem>
                </InfoSection>

                <InfoSection>
                  <SectionTitle>Physical Details</SectionTitle>
                  <InfoItem>
                    <InfoLabel>Age</InfoLabel>
                    <InfoValue>
                      {currentPet.age ? `${currentPet.age} years` : 'Not specified'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Weight</InfoLabel>
                    <InfoValue>
                      {currentPet.weight ? `${currentPet.weight} kg` : 'Not specified'}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Gender</InfoLabel>
                    <InfoValue style={{ textTransform: 'capitalize' }}>
                      {currentPet.gender || 'Not specified'}
                    </InfoValue>
                  </InfoItem>
                </InfoSection>
              </InfoGrid>
            )}
          </ProfileBody>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default PetProfile;
