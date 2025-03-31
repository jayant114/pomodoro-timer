import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GemIcon } from './components/GemIcon';
import { Timer } from './components/Timer';
import { GodRays } from './components/GodRays';
import { LightEffect } from './components/LightEffect';
import { useLocalStorage } from './hooks/useLocalStorage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background: transparent;
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const DateDisplay = styled.div`
  text-align: left;
  font-weight: 400;
  font-size: 16px;
  opacity: 0.8;
`;

const GemCounter = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 20px 8px 15px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: -160px; /* Move content up a bit */
`;

const Title = styled.h1`
  font-size: 120px;
  font-weight: 400;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #175b90, #e787be);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -0.01em; /* -1% character spacing */
`;

const Footer = styled.footer`
  margin-top: auto;
  width: 100%;
  padding: 20px 0;
`;

const formatDate = () => {
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

function App() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(40 * 60); // 40 minutes in seconds
  const [gems, setGems] = useLocalStorage('pomodoro-gems', 0);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(time => {
          if (time > 0) {
            return time - 1;
          } else {
            // Session completed
            clearInterval(interval);
            setIsActive(false);
            setIsPaused(true);
            setGems(gems => gems + 1);
            return 40 * 60;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, setGems]);
  
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };
  
  const handlePause = () => {
    setIsPaused(true);
  };
  
  const handleResume = () => {
    setIsPaused(false);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(40 * 60);
  };
  
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <>
      <GodRays 
        angle={0.8}
        position={0.8}
        spread={0.2}
        cutoff={0.05}
        falloff={0.3}
        edge_fade={0.5}
        speed={0.1}
        ray1_density={4.0}
        ray2_density={14.0}
        ray2_intensity={0.2}
        color={[0.969, 0.969, 0.969, 0.0]}
        seed={5.0}
      />
      <LightEffect />
      <AppContainer>
        <Header>
          <DateDisplay>{formatDate()}</DateDisplay>
          <GemCounter>
            <GemIcon size={20} />
            <span>{gems} gems collected</span>
          </GemCounter>
        </Header>
        
        <MainContent>
          <Title>Be present in now</Title>
          <Timer 
            time={formatTime()} 
            isActive={isActive} 
            isPaused={isPaused}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />
        </MainContent>
        
        <Footer>
          {/* Footer content if needed */}
        </Footer>
      </AppContainer>
    </>
  );
}

export default App; 