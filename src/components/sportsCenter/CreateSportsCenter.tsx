import React, { useState } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { mockSports, mockAmenities } from '../../utils/mockData';
import { Sport } from '../../types';

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

interface CreateSportsCenterProps {
  onCreationComplete?: () => void;
}

const CreateSportsCenter: React.FC<CreateSportsCenterProps> = ({ 
  onCreationComplete 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    latitude: '',
    longitude: ''
  });
  
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createNewSportsCenter } = useSportsCenter();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSportToggle = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId)
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
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
    
    if (selectedSports.length === 0) {
      setError('Please select at least one sport');
      return;
    }
    
    if (selectedAmenities.length === 0) {
      setError('Please select at least one amenity');
      return;
    }
    
    // Validate coordinates
    const latitude = parseFloat(formData.latitude);
    const longitude = parseFloat(formData.longitude);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid coordinates');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Map selected sports to Sport objects
      const sports = mockSports.filter(sport => selectedSports.includes(sport.id));
      
      // Create default opening hours
      const openingHours = {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '18:00' }
      };
      
      const sportsCenterData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website || undefined,
        location: {
          latitude,
          longitude
        },
        sports,
        amenities: selectedAmenities,
        openingHours,
        ownerId: '', // Will be set by the context
        staffIds: []
      };
      
      const result = await createNewSportsCenter(sportsCenterData);
      
      if (result) {
        setSuccess('Sports center created successfully!');
        
        if (onCreationComplete) {
          setTimeout(() => {
            onCreationComplete();
          }, 1500);
        }
      } else {
        setError('Failed to create sports center. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the sports center');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <Title>Create a New Sports Center</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter sports center name"
              required
              data-testid="name-input"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your sports center"
              required
              data-testid="description-input"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Contact Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              required
              data-testid="address-input"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
                data-testid="city-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State"
                required
                data-testid="state-input"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              type="text"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="ZIP Code"
              required
              data-testid="zipcode-input"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                required
                data-testid="phone-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                required
                data-testid="email-input"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Website URL"
              data-testid="website-input"
            />
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Location</SectionTitle>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="Latitude (e.g., 34.0522)"
                required
                data-testid="latitude-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="Longitude (e.g., -118.2437)"
                required
                data-testid="longitude-input"
              />
            </FormGroup>
          </FormRow>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Sports</SectionTitle>
          <p>Select the sports available at your center:</p>
          
          <CheckboxGroup>
            {mockSports.map(sport => (
              <CheckboxLabel key={sport.id}>
                <Checkbox
                  type="checkbox"
                  checked={selectedSports.includes(sport.id)}
                  onChange={() => handleSportToggle(sport.id)}
                  data-testid={`sport-${sport.id}`}
                />
                {sport.icon} {sport.name}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Amenities</SectionTitle>
          <p>Select the amenities available at your center:</p>
          
          <CheckboxGroup>
            {mockAmenities.map(amenity => (
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
        </FormSection>
        
        {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
        {success && <SuccessMessage data-testid="success-message">{success}</SuccessMessage>}
        
        <Button 
          type="submit" 
          disabled={loading}
          data-testid="create-button"
        >
          {loading ? 'Creating...' : 'Create Sports Center'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateSportsCenter; 