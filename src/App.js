import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const SESSION_DURATION = 40 * 60; // 40 minutes in seconds

function App() {
  const [isActive, setIsActive] = useState(false); // Is the session active (started and not reset)?
  const [isPaused, setIsPaused] = useState(true); // Is the timer ticking or paused?
  const [time, setTime] = useState(SESSION_DURATION);
  const [gems, setGems] = useLocalStorage('pomodoro-gems', 0);
  const audioRef = useRef(null);
  const workerRef = useRef(null);

  // Add an effect to handle audio loading
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadeddata', () => {
        console.log('Audio file loaded successfully');
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error('Error loading audio file:', e);
      });
    }
  }, []);

  // Effect to initialize and manage the Web Worker
  useEffect(() => {
    // Create worker instance
    workerRef.current = new Worker(`${process.env.PUBLIC_URL}/timer.worker.js`);

    console.log("Worker created:", workerRef.current);

    // Listen for messages from the worker
    workerRef.current.onmessage = (event) => {
        const { type, time: workerTime } = event.data;
        console.log("App: Received message from worker", event.data);

        if (type === 'tick') {
            setTime(workerTime);
        } else if (type === 'completed') {
            setTime(0);
            setIsActive(false);
            setIsPaused(true);
            setGems(prevGems => prevGems + 1);
            
            // Enhanced sound playing logic with better error handling
            if (audioRef.current) {
                console.log('Attempting to play sound...');
                // Reset the audio to the beginning
                audioRef.current.currentTime = 0;
                // Set volume to make sure it's not muted
                audioRef.current.volume = 1;
                
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('Sound played successfully');
                        })
                        .catch(error => {
                            console.error('Error playing sound:', error);
                            // If autoplay was prevented, show a message or handle it appropriately
                            if (error.name === 'NotAllowedError') {
                                console.log('Autoplay was prevented. User interaction is required.');
                            }
                        });
                } else {
                    console.error('Audio element not found');
                }

                // Reset timer state visually after completion
                setTimeout(() => setTime(SESSION_DURATION), 100);
            }
        }
    };

    workerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
    };

    // Cleanup: Terminate the worker when the component unmounts
    return () => {
        console.log("Terminating worker");
        workerRef.current.terminate();
        workerRef.current = null;
    };
  }, [setGems]); // setGems is stable, so this runs only once on mount

  // Memoized handlers to prevent unnecessary re-renders
  const handleStart = useCallback(() => {
    console.log("App: handleStart");
    setIsActive(true);
    setIsPaused(false);
    // Send start command to worker with the session duration
    if (workerRef.current) {
        workerRef.current.postMessage({ command: 'start', duration: SESSION_DURATION });
    }
  }, []);

  const handlePause = useCallback(() => {
    console.log("App: handlePause");
    setIsPaused(true);
    if (workerRef.current) {
        workerRef.current.postMessage({ command: 'pause' });
    }
  }, []);

  const handleResume = useCallback(() => {
    console.log("App: handleResume");
    setIsPaused(false);
    if (workerRef.current) {
        workerRef.current.postMessage({ command: 'resume' });
    }
  }, []);

  const handleReset = useCallback(() => {
    console.log("App: handleReset");
    setIsActive(false);
    setIsPaused(true);
    // Send reset command to worker
    if (workerRef.current) {
        workerRef.current.postMessage({ command: 'reset', duration: SESSION_DURATION });
    }
    // Reset UI immediately
    setTime(SESSION_DURATION);

    // Stop potential sound if reset during playback
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const displayMinutes = Math.max(0, minutes);
    const displaySeconds = Math.max(0, seconds);

    return `${displayMinutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={`${process.env.PUBLIC_URL}/sounds/timer-complete.mp3`} 
        preload="auto"
        // Add these attributes to ensure audio can play
        playsInline
        controls={false}
        crossOrigin="anonymous"
      />
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