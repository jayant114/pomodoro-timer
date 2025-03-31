import React from 'react';
import styled from 'styled-components';

const LightContainer = styled.div`
  position: fixed;
  top: -100px;
  right: -200px;
  z-index: 0;
  pointer-events: none;
  width: 893px;
  height: 812px;
`;

export const LightEffect = () => {
  return (
    <LightContainer>
      <svg width="893" height="812" viewBox="0 0 893 812" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.14" filter="url(#filter0_f_238_24)">
          <path d="M740.133 -62.4291L573.945 418.472L388.499 692L450.914 266.267C414.362 276.838 267.853 432.156 232.851 473.941C227.093 482.004 224.375 485.58 225.584 483.371C226.38 481.915 228.908 478.648 232.851 473.941C264.577 429.513 388.599 248.875 456.531 149.647L120.782 481.477L480.849 -7.6506L897.517 -167.357L740.133 -62.4291Z" fill="#F7F7F7"/>
        </g>
        <defs>
          <filter id="filter0_f_238_24" x="0.782227" y="-287.357" width="1016.73" height="1099.36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_238_24"/>
          </filter>
        </defs>
      </svg>
    </LightContainer>
  );
}; 