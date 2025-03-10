import React from 'react';
import styled from 'styled-components';
import { SportsCenter } from '../../utils/mockData';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 20px;
`;

const Name = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--primary-color);
`;

const Address = styled.p`
  margin: 0 0 10px;
  color: var(--dark-gray);
  font-size: 14px;
`;

const Description = styled.p`
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.4;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const RatingValue = styled.span`
  font-weight: 500;
  margin-right: 5px;
`;

const RatingStars = styled.div`
  color: var(--accent-color);
`;

const SportsTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
`;

const SportTag = styled.span`
  background-color: var(--light-gray);
  color: var(--text-color);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const BookButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #3d8b40;
  }
`;

interface SportsCenterCardProps {
  sportsCenter: SportsCenter;
  onBookClick: (id: string) => void;
}

const SportsCenterCard: React.FC<SportsCenterCardProps> = ({ sportsCenter, onBookClick }) => {
  const { id, name, address, city, description, rating, image, sports } = sportsCenter;
  
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star">☆</span>);
    }
    
    return stars;
  };
  
  return (
    <Card>
      <ImageContainer>
        <Image src={image} alt={name} />
      </ImageContainer>
      <Content>
        <Name>{name}</Name>
        <Address>{address}, {city}</Address>
        <Rating>
          <RatingValue>{rating}</RatingValue>
          <RatingStars>{renderStars()}</RatingStars>
        </Rating>
        <SportsTags>
          {sports.map((sport, index) => (
            <SportTag key={index}>{sport}</SportTag>
          ))}
        </SportsTags>
        <Description>{description}</Description>
        <BookButton onClick={() => onBookClick(id)}>View Available Times</BookButton>
      </Content>
    </Card>
  );
};

export default SportsCenterCard; 