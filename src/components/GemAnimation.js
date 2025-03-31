import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animation keyframes
const shimmer = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1) rotate(3deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
`;

const GemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${shimmer} 2s ease-in-out infinite;
  position: relative;
`;

const BlurCircle = styled.div`
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background-color: #303dff;
  filter: blur(160px);
  z-index: 0;
`;

// Use an image with proper sizing and aspect ratio
const GemImage = styled.img`
  width: 240px; /* 80px * 3 */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain;
  max-width: 100%;
  position: relative;
  z-index: 1;
`;

export const GemAnimation = () => {
  return (
    <GemContainer>
      <BlurCircle />
      <GemImage 
        src="https://res.cloudinary.com/dotswmlfr/image/upload/v1743074502/jayant1239_a_rare_gem_black_background_premium_surreal_shiny_mu_7a90f93e-364f-44a6-80d4-96221d757991-removebg-preview_goinek.png"
        alt="Gem"
      />
    </GemContainer>
  );
};