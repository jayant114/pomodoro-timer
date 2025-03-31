import React from 'react';
import styled from 'styled-components';
import { GemAnimation } from './GemAnimation';
import ResetIcon from './ResetIcon';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
`;

const GemSection = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const ControlsSection = styled.div`
  width: auto;
  display: inline-flex;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-radius: 100px;
  padding: 20px 28px 20px 36px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid transparent;
  background-clip: padding-box;
  position: relative;
  gap: 32px;
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 100px;
    padding: 1px;
    background: linear-gradient(150deg, rgba(217, 217, 217, 0.2), rgba(55, 55, 55, 0.2));
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 1;
  }
`;

const TimerDisplay = styled.div`
  font-size: 48px;
  font-weight: 400;
  color: #E0E0FF;
  line-height: 1;
  letter-spacing: -0.01em;
  margin: 0;
`;

const ButtonsWrapper = styled.div`
  position: relative;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ControlButton = styled.button`
  background-color: ${props => props.variant === 'primary' ? '#4425A7' : '#8B0065'};
  color: white;
  border: none;
  border-radius: ${props => props.round ? '50%' : '50px'};
  padding: ${props => props.round ? '0' : '10px 28px'};
  width: ${props => {
    if (props.round) return '72px';
    if (props.start) return '208px';
    return '140px';
  }};
  height: 72px;
  font-size: 28px;
  font-weight: 400;
  font-family: "Instrument Serif", serif;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: -0.01em;
  margin: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: ${props => props.variant === 'primary' ? '0 0 0 2px rgba(78, 134, 255, 0.5)' : 'none'};

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#3A1F94' : '#A30075'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

export const Timer = ({ 
  time, 
  isActive, 
  isPaused, 
  onStart, 
  onPause, 
  onResume, 
  onReset 
}) => {
  return (
    <TimerContainer>
      <GemSection>
        <GemAnimation />
      </GemSection>
      
      <ControlsSection>
        <TimerDisplay>{time}</TimerDisplay>
        
        <ButtonsWrapper>
          {!isActive && (
            <ControlButton 
              variant="primary" 
              start 
              onClick={onStart}
            >
              Start focusing
            </ControlButton>
          )}
          
          {isActive && (
            <ButtonContainer>
              {isPaused ? (
                <ControlButton variant="primary" onClick={onResume}>
                  Resume
                </ControlButton>
              ) : (
                <ControlButton variant="primary" onClick={onPause}>
                  Pause
                </ControlButton>
              )}
              
              <ControlButton 
                round 
                variant="secondary" 
                onClick={onReset}
              >
                <ResetIcon size={32} />
              </ControlButton>
            </ButtonContainer>
          )}
        </ButtonsWrapper>
      </ControlsSection>
    </TimerContainer>
  );
}; 