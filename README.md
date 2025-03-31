# Pomodoro Timer

A beautiful Pomodoro timer application that helps you stay focused with 25-minute work sessions.

![Pomodoro Timer Screenshot](screenshot.png)

## Features

- 25-minute focused work sessions
- Pause and resume functionality
- Gem collection system after completing sessions
- Lifetime gem counter tracking your productivity
- Beautiful UI with animated gem visualization

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/jayant114/pomodoro-timer.git
cd pomodoro-timer
```

2. Install dependencies
```
npm install
# or
yarn install
```

3. Start the development server
```
npm start
# or
yarn start
```

The application will open in your default web browser at `http://localhost:3000`.

## Usage

1. Click "Start focusing" to begin a 25-minute Pomodoro session
2. Use the "Pause" button if you need to temporarily stop the timer
3. Use "Resume" to continue where you left off
4. Complete a session to earn a gem, which will be stored permanently
5. The gem counter in the top-right shows your lifetime productivity score

## How it works

The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This application implements this technique with the following components:

- A 25-minute countdown timer
- Visual feedback of your progress
- A reward system (gems) to incentivize completed sessions
- Local storage to track your lifetime productivity

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Pomodoro Technique developed by Francesco Cirillo
- Built with React and styled-components
