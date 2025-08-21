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
      src="https://ik.imagekit.io/aaoge3hhs/gem.png?updatedAt=1755765496704" 
      alt="Gem Icon"
      size={size}
    />
  );
}; 
