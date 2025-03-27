import React from 'react';
import styled from 'styled-components';

// Create a styled image component with proper sizing
const GemImage = styled.img`
  width: ${props => props.size * 3}px;
  height: auto; /* Maintain aspect ratio */
  object-fit: contain;
  max-width: 100%;
`;

export const GemIcon = ({ size = 24 }) => {
  // Use the Cloudinary gem image
  return (
    <GemImage 
      src="https://res.cloudinary.com/dotswmlfr/image/upload/v1743074502/jayant1239_a_rare_gem_black_background_premium_surreal_shiny_mu_7a90f93e-364f-44a6-80d4-96221d757991-removebg-preview_goinek.png" 
      alt="Gem Icon"
      size={size}
    />
  );
}; 