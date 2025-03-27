import React from 'react';
import styled from 'styled-components';
import { GemAnimation } from './GemAnimation';

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
  width: 100%;
  max-width: 700px;
  background-color: rgba(18, 18, 40, 0.9);
  border-radius: 100px;
  padding: 12px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(5px);
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
    background: linear-gradient(to right, #373737, #D9D9D9);
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
  font-size: 72px;
  font-weight: 300;
  color: #E0E0FF;
  line-height: 1;
  letter-spacing: 4px;
  margin: 0;
  padding-left: 25px;
  font-family: 'Instrument Serif', Georgia, serif;
`;

const ControlButton = styled.button`
  background-color: #242080;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 28px;
  font-size: 22px;
  font-weight: 400;
  font-family: 'Instrument Serif', Georgia, serif;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  margin: 0;
  max-width: 250px;
  white-space: nowrap;

  &:hover {
    background-color: #4B0082;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
        
        <ButtonContainer>
          {!isActive && (
            <ControlButton onClick={onStart}>Start focusing</ControlButton>
          )}
          
          {isActive && isPaused && (
            <ControlButton onClick={onResume}>Resume</ControlButton>
          )}
          
          {isActive && !isPaused && (
            <ControlButton onClick={onPause}>Pause</ControlButton>
          )}
          
          {isActive && isPaused && (
            <ControlButton onClick={onReset} style={{ backgroundColor: 'rgba(75, 0, 130, 0.5)' }}>Reset</ControlButton>
          )}
        </ButtonContainer>
      </ControlsSection>
    </TimerContainer>
  );
}; 