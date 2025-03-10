import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: white;
  padding: 20px 0;
  border-top: 1px solid var(--medium-gray);
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  margin: 0;
  color: var(--dark-gray);
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const FooterLink = styled.a`
  color: var(--dark-gray);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>&copy; {currentYear} QuadraGo. All rights reserved.</Copyright>
        <FooterLinks>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 