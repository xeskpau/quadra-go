import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Login from './Login';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  position: relative;
  border-radius: 10px;
  background-color: white;
  animation: fadeIn 0.3s ease-out;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #718096;
  z-index: 10;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2d3748;
    background-color: #f7fafc;
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
  }
`;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay 
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <ModalContent ref={modalContentRef}>
        <CloseButton 
          onClick={onClose}
          aria-label="Close modal"
          data-testid="close-modal-button"
        >
          ✕
        </CloseButton>
        <Login onClose={onClose} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal; 