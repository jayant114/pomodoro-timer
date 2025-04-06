let intervalId = null;
let targetTime = null; // Timestamp when the timer should end (ms)
let remainingOnPause = null; // Milliseconds remaining when paused
let isRunning = false;
const TICK_INTERVAL = 250; // How often to check and post time (ms)

// Listen for messages from the main thread
self.onmessage = function(event) {
    const { command, duration } = event.data; // duration in seconds

    if (command === 'start') {
        console.log('Worker: Received start', duration);
        if (intervalId) clearInterval(intervalId); // Clear previous interval if any
        targetTime = Date.now() + duration * 1000;
        remainingOnPause = null; // Clear paused state
        isRunning = true;
        tick(); // Initial tick to update immediately
        intervalId = setInterval(tick, TICK_INTERVAL);
    } else if (command === 'pause') {
        console.log('Worker: Received pause');
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        // Store remaining time only if it was running and has a target
        if (isRunning && targetTime) {
            remainingOnPause = targetTime - Date.now();
        }
        isRunning = false;
        // Post the paused time
        postTime();
    } else if (command === 'resume') {
        console.log('Worker: Received resume');
         // Resume only if it was paused (remainingOnPause is set)
        if (!isRunning && remainingOnPause !== null) {
            if (intervalId) clearInterval(intervalId); // Clear just in case
            targetTime = Date.now() + remainingOnPause; // Recalculate target based on remaining
            remainingOnPause = null; // Clear paused state
            isRunning = true;
            tick(); // Initial tick
            intervalId = setInterval(tick, TICK_INTERVAL);
        }
    } else if (command === 'reset') {
        console.log('Worker: Received reset', duration);
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        targetTime = null; // Clear target
        remainingOnPause = null; // Clear pause state
        isRunning = false;
        // Post the full duration back as the reset time
        self.postMessage({ type: 'tick', time: duration });
    }
};

// Function to calculate and post the time
function tick() {
    // If not running or no target time set, do nothing (should be cleared by pause/reset)
    if (!isRunning || !targetTime) {
        if(intervalId) clearInterval(intervalId); // Safeguard clear
        intervalId = null;
        return;
    }
    postTime();
}

// Helper function to post time/completion
function postTime() {
     // If paused, use the stored remaining time, otherwise calculate from target
    let currentRemainingMs = remainingOnPause !== null ? remainingOnPause : (targetTime ? targetTime - Date.now() : 0);

    if (currentRemainingMs <= 0) {
        // Timer finished or paused at zero
        if (intervalId) clearInterval(intervalId); // Stop ticking if finished
        intervalId = null;

         // Only send 'completed' if it was running and reached zero naturally
         // If remainingOnPause is set, it means we are paused, so just send tick
         if (isRunning && targetTime && remainingOnPause === null) {
            console.log('Worker: Completed');
            isRunning = false; // Stop running state
            targetTime = null; // Clear target
            self.postMessage({ type: 'completed', time: 0 });
         } else {
            // If paused (at zero or otherwise) or already finished, just send tick update
             console.log('Worker: Posting tick (<= 0)', 0);
            self.postMessage({ type: 'tick', time: 0 });
         }

    } else {
        // Timer is running, post remaining seconds (rounded up)
        const remainingSeconds = Math.ceil(currentRemainingMs / 1000);
        // console.log('Worker: Posting tick', remainingSeconds); // Debug logging
        self.postMessage({ type: 'tick', time: Math.max(0, remainingSeconds) }); // Ensure time is not negative
    }
}

// Optional: Handle worker termination signal if needed, though browser usually handles it.
// self.onclose = function() {
//     console.log('Worker closing, clearing interval.');
//     if (intervalId) clearInterval(intervalId);
// };

console.log('Timer worker started.'); 