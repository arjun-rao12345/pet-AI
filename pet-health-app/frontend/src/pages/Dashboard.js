import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaComments, FaEdit, FaTrash, FaPaw } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { usePets } from '../context/PetContext';

const DashboardContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
  padding: 40px 0;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
`;

const AddPetButton = styled(Link)`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const PetCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PetCardHeader = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const PetName = styled.h3`
  color: #333;
  margin-bottom: 5px;
  font-size: 1.3rem;
`;

const PetType = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const PetCardBody = styled.div`
  padding: 20px;
`;

const PetInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
`;

const PetInfoItem = styled.div`
  color: #666;
  
  strong {
    color: #333;
  }
`;

const PetActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled(Link)`
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &.chat {
    background: #667eea;
    color: white;
  }
  
  &.chat:hover {
    background: #5a67d8;
  }
  
  &.edit {
    background: #ffc107;
    color: #212529;
  }
  
  &.edit:hover {
    background: #e0a800;
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  &:hover {
    background: #c82333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const EmptyStateText = styled.p`
  margin-bottom: 30px;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { pets, loading, getPets, deletePet } = usePets();

  useEffect(() => {
    getPets();
  }, []);

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      await deletePet(petId);
    }
  };

  return (
    <DashboardContainer>
      <DashboardContent>
        <WelcomeSection>
          <WelcomeTitle>
            <FaPaw />
            Welcome back, {user?.name}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Manage your pets and get AI-powered health advice
          </WelcomeSubtitle>
        </WelcomeSection>

        <SectionHeader>
          <SectionTitle>Your Pets</SectionTitle>
          <AddPetButton to="/add-pet">
            <FaPlus />
            Add New Pet
          </AddPetButton>
        </SectionHeader>

        {loading ? (
          <LoadingSpinner>
            <Spinner />
          </LoadingSpinner>
        ) : pets.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FaPaw />
            </EmptyStateIcon>
            <EmptyStateTitle>No pets added yet</EmptyStateTitle>
            <EmptyStateText>
              Start by adding your first pet to get personalized health advice and care recommendations.
            </EmptyStateText>
            <AddPetButton to="/add-pet">
              <FaPlus />
              Add Your First Pet
            </AddPetButton>
          </EmptyState>
        ) : (
          <PetsGrid>
            {pets.map((pet) => (
              <PetCard key={pet._id}>
                <PetCardHeader>
                  <PetName>{pet.name}</PetName>
                  <PetType>{pet.type}</PetType>
                </PetCardHeader>
                <PetCardBody>
                  <PetInfo>
                    <PetInfoItem>
                      <strong>Breed:</strong> {pet.breed || 'Not specified'}
                    </PetInfoItem>
                    <PetInfoItem>
                      <strong>Age:</strong> {pet.age ? `${pet.age} years` : 'Not specified'}
                    </PetInfoItem>
                    <PetInfoItem>
                      <strong>Weight:</strong> {pet.weight ? `${pet.weight} kg` : 'Not specified'}
                    </PetInfoItem>
                    <PetInfoItem>
                      <strong>Gender:</strong> {pet.gender || 'Not specified'}
                    </PetInfoItem>
                  </PetInfo>
                  <PetActions>
                    <ActionButton to={`/chat/${pet._id}`} className="chat">
                      <FaComments />
                      Chat
                    </ActionButton>
                    <ActionButton to={`/pet/${pet._id}`} className="edit">
                      <FaEdit />
                      Edit
                    </ActionButton>
                    <DeleteButton onClick={() => handleDeletePet(pet._id)}>
                      <FaTrash />
                      Delete
                    </DeleteButton>
                  </PetActions>
                </PetCardBody>
              </PetCard>
            ))}
          </PetsGrid>
        )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
