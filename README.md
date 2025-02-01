# Pomodoro Timer 🍅

## Preview

[Preview directly the app on Codepen](https://codepen.io/kalvin-eliazord/pen/dPbQzQB)

## Overview

This project is a **Pomodoro Timer** built using JavaScript. It helps users stay productive by implementing the Pomodoro Technique, which consists of work and break intervals. Users can create tasks, track progress, and customize settings.

## Features

- **Start, Pause, and Stop Pomodoro sessions**
- **Work and Break timers (Short and Long breaks)**
- **Customizable durations**
- **Task management (add, delete, and mark as done)**
- **Progress tracking with a visual bar**
- **Audio notifications for breaks**
- **Confetti celebration for completed cycles**

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pomodoro-timer.git
   ```
2. Navigate to the project folder:
   ```sh
   cd pomodoro-timer
   ```
3. Open `index.html` in a browser.

## Usage

### Starting a Pomodoro Session

- Click the **Start** button to begin the Pomodoro session.
- Click **Pause** to pause the timer.
- Click **Stop** to end the session early.

### Task Management

- Enter a task name in the input field and press **Enter** to add a new task.
- Click the **Start** button next to a task to focus on it.
- Click the **Delete** button to remove a task.

### Customizing Settings

- Click the **Settings** button to adjust work, short break, long break, and long break delay durations.
- Click **Save** to apply the new settings.

## Timer Logic

The Pomodoro timer operates as follows:

1. **Work Phase:** Starts with a set duration (default: 25 minutes).
2. **Short Break:** Triggers after a completed work session (default: 5 minutes).
3. **Long Break:** Occurs after a set number of Pomodoro cycles (default: every 4 cycles, 15 minutes).
4. **Repeat:** The cycle continues until stopped manually.

## UI Components

| Component                                                               | Description                                |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| `startButton`                                                           | Starts or pauses the Pomodoro timer        |
| `stopButton`                                                            | Stops the timer and resets the session     |
| `progressBar`                                                           | Visual representation of remaining time    |
| `addTodoTaskInput`                                                      | Input field to add new tasks               |
| `todoTaskUl`                                                            | List of pending tasks                      |
| `doneTaskUl`                                                            | List of completed tasks                    |
| `workInput`, `shortBreakInput`, `longBreakInput`, `longBreakDelayInput` | Settings inputs for duration customization |

## Customization

To modify the Pomodoro cycle for testing, update the values in:

```js
const getTestPomodoroCycle = (longBreakDelay) => {
  const seconds = 4;
  const shortBreakSeconds = 3;
  const longBreakSeconds = 4;
  ...
};
```

Change the `seconds`, `shortBreakSeconds`, and `longBreakSeconds` values as needed.

## Contributing

Feel free to submit issues or pull requests to improve the project.

## License

This project is licensed under the MIT License.

---

Happy focusing! 🍅

