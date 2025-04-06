import React, { useState, useEffect, useRef } from 'react';
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
  const [time, setTime] = useState(40 * 60); // Time remaining in seconds
  const [gems, setGems] = useLocalStorage('pomodoro-gems', 0);
  const audioRef = useRef(null);
  const startTimeRef = useRef(null); // Timestamp when timer (re)started
  const pauseTimeRef = useRef(null); // Remaining time (seconds) when paused
  const intervalRef = useRef(null); // Ref to store the interval ID
  
  useEffect(() => {
    // Clear previous interval if dependencies change
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isActive && !isPaused) {
      // If startTimeRef is null, it means we need to set the start time.
      // This happens on initial start or on resume.
      if (startTimeRef.current === null) {
           startTimeRef.current = Date.now();
           // If pauseTimeRef is null, we are starting fresh (or after a reset).
           // Ensure the time state is set to the full duration if starting fresh.
           if (pauseTimeRef.current === null) {
               setTime(40 * 60);
           }
      }

      // The time duration we are counting down from.
      // If resuming, it's the time saved at pause. Otherwise, it's the full duration.
      const durationToCountDownFrom = pauseTimeRef.current !== null ? pauseTimeRef.current : 40 * 60;

      intervalRef.current = setInterval(() => {
        const elapsedMilliseconds = Date.now() - startTimeRef.current;
        const remainingTime = durationToCountDownFrom - Math.floor(elapsedMilliseconds / 1000);

        if (remainingTime > 0) {
          setTime(remainingTime);
        } else {
          // Session completed
          setTime(0); // Show 0:00
          clearInterval(intervalRef.current); // Use ref to clear
          intervalRef.current = null;
          setIsActive(false);
          setIsPaused(true);
          setGems(gems => gems + 1); // Use callback form

          // Play completion sound
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
          }

          // Reset refs for the completed session
          startTimeRef.current = null;
          pauseTimeRef.current = null;
        }
      }, 100); // Check frequently for smoother display updates

    } else {
      // If timer becomes inactive (paused or reset), clear start time ref.
       if (isPaused || !isActive) {
           startTimeRef.current = null;
       }
    }

    // Cleanup function to clear interval when component unmounts or effect re-runs
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
  // Dependencies: isActive and isPaused control the interval logic.
  // setGems is included as it's used in the completion logic.
  }, [isActive, isPaused, setGems]);
  
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setTime(40 * 60); // Explicitly set time on new start
    startTimeRef.current = Date.now(); // Record start time
    pauseTimeRef.current = null; // Clear any previous paused state
  };
  
  const handlePause = () => {
    setIsPaused(true);
    // When pausing, record the *current* remaining time from the state
    pauseTimeRef.current = time;
    // Clear start time ref since elapsed time calculation stops
    startTimeRef.current = null;
     // Clear interval via effect cleanup by changing isPaused state
  };
  
  const handleResume = () => {
    setIsPaused(false);
    // Record the time when resuming. The effect will use pauseTimeRef.current.
    startTimeRef.current = Date.now();
    // Effect will restart the interval
  };
  
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(true);
    setTime(40 * 60);
    // Clear refs
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    // Clear interval via effect cleanup
    // Stop potential sound if reset during playback (edge case)
     if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
     }
  };
  
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // Ensure time doesn't display negative values if there's a slight delay
    const displayMinutes = Math.max(0, minutes);
    const displaySeconds = Math.max(0, seconds);

    return `${displayMinutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
  };
  
  return (
    <>
      <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/sounds/timer-complete.mp3`} />
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