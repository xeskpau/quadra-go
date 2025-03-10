import React, { useState } from 'react';
import styled from 'styled-components';
import { useSportsCenter } from '../../contexts/SportsCenterContext';
import { Promotion } from '../../types';

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

const PromotionsList = styled.div`
  margin-top: 2rem;
`;

const PromotionCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PromotionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PromotionName = styled.h4`
  margin: 0;
  color: #2d3748;
`;

const PromotionDiscount = styled.span`
  background-color: #C6F6D5;
  color: #22543D;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const PromotionDetails = styled.div`
  margin-bottom: 1rem;
`;

const PromotionDetail = styled.p`
  margin: 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
`;

const PromotionCode = styled.div`
  background-color: #EBF4FF;
  border: 1px dashed #3182CE;
  border-radius: 4px;
  padding: 0.5rem;
  font-family: monospace;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
`;

const Badge = styled.span<{ $active: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  background-color: ${props => props.$active ? '#C6F6D5' : '#FED7D7'};
  color: ${props => props.$active ? '#22543D' : '#822727'};
`;

interface PromotionManagerProps {
  onComplete?: () => void;
}

const PromotionManager: React.FC<PromotionManagerProps> = ({ onComplete }) => {
  const { currentSportsCenter, promotions, addPromotion } = useSportsCenter();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    code: '',
    usageLimit: ''
  });
  
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
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
  
  const generatePromoCode = () => {
    if (!formData.name) {
      setError('Please enter a promotion name first');
      return;
    }
    
    if (!formData.discountPercentage) {
      setError('Please enter a discount percentage first');
      return;
    }
    
    // Generate a code based on the promotion name and discount
    const namePrefix = formData.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
    
    const discount = parseInt(formData.discountPercentage);
    const code = `${namePrefix}${discount}`;
    
    setFormData(prev => ({ ...prev, code }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSportsCenter) {
      setError('No sports center selected');
      return;
    }
    
    if (selectedSports.length === 0) {
      setError('Please select at least one sport');
      return;
    }
    
    // Validate numeric fields
    const discountPercentage = parseInt(formData.discountPercentage);
    const usageLimit = formData.usageLimit ? parseInt(formData.usageLimit) : undefined;
    
    if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
      setError('Please enter a valid discount percentage (1-100)');
      return;
    }
    
    if (usageLimit !== undefined && (isNaN(usageLimit) || usageLimit <= 0)) {
      setError('Please enter a valid usage limit');
      return;
    }
    
    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (isNaN(startDate.getTime())) {
      setError('Please enter a valid start date');
      return;
    }
    
    if (isNaN(endDate.getTime())) {
      setError('Please enter a valid end date');
      return;
    }
    
    if (startDate >= endDate) {
      setError('End date must be after start date');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const promotionData: Omit<Promotion, 'id'> = {
        sportsCenterId: currentSportsCenter.id,
        name: formData.name,
        description: formData.description,
        discountPercentage,
        startDate,
        endDate,
        applicableSportIds: selectedSports,
        applicableFacilityIds: [], // This would be populated if we had facility selection
        code: formData.code,
        usageLimit,
        currentUsage: 0
      };
      
      const result = await addPromotion(promotionData);
      
      if (result) {
        setSuccess('Promotion added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          discountPercentage: '',
          startDate: '',
          endDate: '',
          code: '',
          usageLimit: ''
        });
        setSelectedSports([]);
        
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 1500);
        }
      } else {
        setError('Failed to add promotion. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the promotion');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  // Check if promotion is active
  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    return new Date(promotion.startDate) <= now && new Date(promotion.endDate) >= now;
  };
  
  if (!currentSportsCenter) {
    return (
      <Container>
        <Title>Promotion Manager</Title>
        <p>Please select a sports center first.</p>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>Promotion Manager</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Create New Promotion</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Promotion Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter promotion name"
              required
              data-testid="promotion-name-input"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the promotion"
              required
              data-testid="description-input"
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="discountPercentage">Discount Percentage</Label>
              <Input
                id="discountPercentage"
                name="discountPercentage"
                type="number"
                min="1"
                max="100"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                placeholder="Discount percentage (e.g., 20)"
                required
                data-testid="discount-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input
                id="usageLimit"
                name="usageLimit"
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={handleInputChange}
                placeholder="Maximum number of uses"
                data-testid="usage-limit-input"
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                data-testid="start-date-input"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                data-testid="end-date-input"
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="code">Promotion Code</Label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Promotion code"
                required
                data-testid="code-input"
                style={{ flex: 1 }}
              />
              <Button 
                type="button" 
                onClick={generatePromoCode}
                data-testid="generate-code-button"
                style={{ padding: '0.75rem 1rem' }}
              >
                Generate
              </Button>
            </div>
          </FormGroup>
          
          <FormGroup>
            <Label>Applicable Sports</Label>
            <CheckboxGroup>
              {currentSportsCenter.sports.map(sport => (
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
          </FormGroup>
        </FormSection>
        
        {error && <ErrorMessage data-testid="error-message">{error}</ErrorMessage>}
        {success && <SuccessMessage data-testid="success-message">{success}</SuccessMessage>}
        
        <Button 
          type="submit" 
          disabled={loading}
          data-testid="add-promotion-button"
        >
          {loading ? 'Creating...' : 'Create Promotion'}
        </Button>
      </Form>
      
      <PromotionsList>
        <SectionTitle>Current Promotions</SectionTitle>
        
        {promotions.length > 0 ? (
          promotions.map(promotion => (
            <PromotionCard key={promotion.id}>
              <PromotionHeader>
                <PromotionName>
                  {promotion.name}
                  <Badge $active={isPromotionActive(promotion)}>
                    {isPromotionActive(promotion) ? 'Active' : 'Inactive'}
                  </Badge>
                </PromotionName>
                <PromotionDiscount>{promotion.discountPercentage}% OFF</PromotionDiscount>
              </PromotionHeader>
              
              <PromotionDetails>
                <PromotionDetail>{promotion.description}</PromotionDetail>
                <PromotionDetail>
                  <strong>Valid:</strong> {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                </PromotionDetail>
                <PromotionDetail>
                  <strong>Usage:</strong> {promotion.currentUsage} / {promotion.usageLimit || '∞'}
                </PromotionDetail>
                <PromotionDetail>
                  <strong>Applicable Sports:</strong> {
                    promotion.applicableSportIds.map(sportId => {
                      const sport = currentSportsCenter.sports.find(s => s.id === sportId);
                      return sport ? sport.name : '';
                    }).join(', ')
                  }
                </PromotionDetail>
              </PromotionDetails>
              
              <PromotionCode>
                {promotion.code}
              </PromotionCode>
            </PromotionCard>
          ))
        ) : (
          <p>No promotions added yet.</p>
        )}
      </PromotionsList>
    </Container>
  );
};

export default PromotionManager; 