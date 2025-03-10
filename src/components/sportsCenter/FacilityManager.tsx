import React, { useState } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { Facility } from '../../types';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0072ff;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2);
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const Button = styled.button`
  background-color: #0072ff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0058cc;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.p`
  color: #38a169;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const FacilitiesList = styled.div`
  margin-top: 2rem;
`;

const FacilityCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FacilityInfo = styled.div`
  flex: 1;
`;

const FacilityName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2d3748;
`;

const FacilityDetail = styled.p`
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

interface FacilityManagerProps {
  onComplete?: () => void;
}

const FacilityManager: React.FC<FacilityManagerProps> = ({ onComplete }) => {
  const { currentSportsCenter, facilities, addFacility } = useSportsCenter();
  
  const [formData, setFormData] = useState({
    name: '',
    sportId: '',
    description: '',
    capacity: '',
    pricePerHour: '',
    isIndoor: true
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: (e.target as HTMLInputElement).checked 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSportsCenter) {
      setError('No sports center selected');
      return;
    }
    
    if (!formData.sportId) {
      setError('Please select a sport');
      return;
    }
    
    // Validate numeric fields
    const capacity = parseInt(formData.capacity);
    const pricePerHour = parseFloat(formData.pricePerHour);
    
    if (isNaN(capacity) || capacity <= 0) {
      setError('Please enter a valid capacity');
      return;
    }
    
    if (isNaN(pricePerHour) || pricePerHour <= 0) {
      setError('Please enter a valid price per hour');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const facilityData: Omit<Facility, 'id'> = {
        sportsCenterId: currentSportsCenter.id,
        name: formData.name,
        sportId: formData.sportId,
        description: formData.description || undefined,
        capacity,
        pricePerHour,
        isIndoor: formData.isIndoor,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined
      };
      
      const result = await addFacility(facilityData);
      
      if (result) {
        setSuccess('Facility added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          sportId: '',
          description: '',
          capacity: '',
          pricePerHour: '',
          isIndoor: true
        });
        setSelectedAmenities([]);
        
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      } else {
        setError('Failed to add facility. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the facility');
    } finally {
      setLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get sport name by ID
  const getSportName = (sportId: string) => {
    if (!currentSportsCenter) return 'Unknown';
    
    const sport = currentSportsCenter.sports.find(s => s.id === sportId);
    return sport ? sport.name : 'Unknown';
  };
  
  if (!currentSportsCenter) {
    return (
      <Container>
        <Title>Facility Manager</Title>
        <p>Please select a sports center first.</p>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Facility Manager</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Add New Facility</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Facility Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter facility name"
              required
              data-testid="facility-name-input"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="sportId">Sport</Label>
            <Select
              id="sportId"
              name="sportId"
              value={formData.sportId}
              onChange={handleInputChange}
              required
              data-testid="sport-select"
            >
              <option value="">Select a sport</option>
              {currentSportsCenter.sports.map(sport => (
                <option key={sport.id} value={sport.id}>
                  {sport.icon} {sport.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the facility"
              data-testid="description-input"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="Number of people"
                required
                data-testid="capacity-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="pricePerHour">Price per Hour</Label>
              <Input
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricePerHour}
                onChange={handleInputChange}
                placeholder="Price in USD"
                required
                data-testid="price-input"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="isIndoor"
                checked={formData.isIndoor}
                onChange={handleInputChange}
                data-testid="indoor-checkbox"
              />
              Indoor Facility
            </CheckboxLabel>
          </FormGroup>
          
          <FormGroup>
            <Label>Amenities (Optional)</Label>
            <CheckboxGroup>
              {currentSportsCenter.amenities.map(amenity => (
                <CheckboxLabel key={amenity}>
                  <Checkbox
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    data-testid={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  {amenity}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
          </FormGroup>
        </FormSection>
        
        {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
        {success && <SuccessMessage data-testid="success-message">{success}</SuccessMessage>}
        
        <Button 
          type="submit" 
          disabled={loading}
          data-testid="add-facility-button"
        >
          {loading ? 'Adding...' : 'Add Facility'}
        </Button>
      </Form>
      
      <FacilitiesList>
        <SectionTitle>Current Facilities</SectionTitle>
        
        {facilities.length > 0 ? (
          facilities.map(facility => (
            <FacilityCard key={facility.id}>
              <FacilityInfo>
                <FacilityName>{facility.name}</FacilityName>
                <FacilityDetail>
                  {getSportName(facility.sportId)} | 
                  Capacity: {facility.capacity} | 
                  {formatCurrency(facility.pricePerHour)}/hour | 
                  {facility.isIndoor ? 'Indoor' : 'Outdoor'}
                </FacilityDetail>
                {facility.description && (
                  <FacilityDetail>{facility.description}</FacilityDetail>
                )}
              </FacilityInfo>
              
              <ButtonGroup>
                <ActionButton 
                  type="button"
                  title="View Details"
                  data-testid={`view-facility-${facility.id}`}
                >
                  👁️
                </ActionButton>
                <ActionButton 
                  type="button"
                  title="Edit Facility"
                  data-testid={`edit-facility-${facility.id}`}
                >
                  ✏️
                </ActionButton>
              </ButtonGroup>
            </FacilityCard>
          ))
        ) : (
          <p>No facilities added yet.</p>
        )}
      </FacilitiesList>
    </Container>
  );
};

export default FacilityManager; 