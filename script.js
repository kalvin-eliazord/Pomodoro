console.clear();

const $ = (className) => document.querySelector(className);
const $all = (className) => document.querySelectorAll(className);
const newElement = (elementName) => document.createElement(elementName);

const minutesInput = $(".minutes");
const secondsInput = $(".seconds");
const startButton = $(".startButton");
const todo = $(".todo");
const done = $(".done");
const darkBg = $(".darkBg");
const modal = $(".modal");
const settingsButton = $(".settingsButton");
const settingsInputs = $all(".settingsInput");
const topBackground = $(".top");
const saveSettingsButton = $(".saveSettingsButton");
const closeSettingsButton = $(".closeSettingsButton");
const shortBreakDuration = $(".shortBreakDuration");
const longBreakDuration = $(".longBreakDuration");
const longBreakDelay = $(".longBreakDelay");

const getTimer = (minutesInput, secondsInput = "0") => {
  return {
    minutes: parseInt(minutesInput.value),
    seconds: parseInt(secondsInput.value)
  };
};

const resetTimer = () => {
  return {
    minutes: "45",
    seconds: "00"
  };
};

const setFrontTimer = (timer) => {
  minutesInput.value =
    timer.minutes < 10
      ? "0" + timer.minutes.toString()
      : timer.minutes.toString();
  secondsInput.value =
    timer.seconds < 10
      ? "0" + timer.seconds.toString()
      : timer.seconds.toString();
};

const getPomodoro = (shortBreaktTimer, longBreakTimer, longBreakDelay) => {
  return {
    shortBreaktTimer: getTimer(parseInt(shortBreakDuration)),
    longBreakTimer: getTimer(parseInt(longBreakDuration)),
    longBreakDelay: getTimer(parseInt(longBreakDelay)),
    longBreakDelayMax: longBreakDelay.minutes
  }
};

const setBreaksSettings = (shortBreakMinutes, longBreakMinutes, longBreakDelay) => {
  shortBreakDuration.innerText = shortBreakMinutes;
  longBreakDuration.innerText = longBreakMinutes;
  longBreakDelay.innerText = longBreakDelay;
};

currPomodoro = getPomodoro(10, 30, 4);
setBreaksSettings(currPomodoro);

// Modal
settingsButton.addEventListener("click", () => {
  modal.style.display = "flex";
  darkBg.style.display = "inline-block";
});

closeSettingsButton.addEventListener("click", () => {
  modal.style.display = "none";
  darkBg.style.display = "none";
});

saveSettingsButton.addEventListener("click", () => {
  const isInvalid = Array.from(settingsInputs).some(
    (input) =>
      input.value === "" || parseInt(input.value) === 0 || isNaN(input.value)
  );

  if (isInvalid) return;

  const pomodoro = getPomodoro(
    settingsInputs[0].value,
    settingsInputs[1].value,
    settingsInputs[2].value
  );

  setBreaksSettings(
    pomodoro.shortBreakDuration,
    pomodoro.longBreakDuration,
    pomodoro.longBreakDelay
  );

  currPomodoro = pomodoro;
});

// Pomodoro timer
let todoElements = [];
let interval = null;
startButton.addEventListener("click", () => {
  startButton.innerText =
    startButton.innerText !== "P A U S E" ? "P A U S E" : "S T A R T";

  const workTimer = getTimer(minutesInput, secondsInput);
  clearInterval(interval);
  interval = setInterval(() => {
    if (!workTimer.isDone) {
      startWorkTimer(workTimer);
    } else if (currPomodoro.longBreakDelay > 1) {
      topBackground.style.background = "green";
      stopButton.innerText = "S K I P";
      startShortBreakTimer();
    } else {
      startLongBreakTimer();
    }
  }, 1000);
});

const startWorkTimer = (timer) => {
  if (timer.seconds < 1 && timer.minutes > 0) {
    --timer.minutes;
    timer.seconds = 59;
  } else if (timer.seconds > 0) {
    --timer.seconds;
  } else {
    // Timer finished
    if (todoElements.length > 0) {
      createDoneTask(todoElements[0].input.value);
      todoElements[0].li.remove();
      todoElements.shift();
      titlePomodoro.innerText = todoElements[0].input.value;
      clearInterval(interval);
    } else {
      createDoneTask("");
      clearInterval(interval);
    }

    topBackground.style.background = "green";
    stopButton.innerText = "S K I P";
    setFrontTimer(resetTimer());
  }

  if (startButton.innerText === "S T A R T") clearInterval(interval);
  else setFrontTimer(timer);
};

// Pomodoro break
const startShortBreakTimer = () => {};

const startLongBreakTimer = () => {};

const stopButton = $(".stopButton");
stopButton.addEventListener("click", () => {
  startButton.innerText = "S T A R T";

  // Reset Timer based on the settings (pomodoro obj)
  clearInterval(interval);
  setFrontTimer(resetTimer());
});

const titlePomodoro = $(".titlePomodoro");
const addTaskInput = $(".addTask");
addTaskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  createTodoTask(addTaskInput);
});

const createTodoTask = (addTaskInput) => {
  renderTask(getTask(false, addTaskInput.value));
  titlePomodoro.innerText = todoElements[0].input.value;
  addTaskInput.value = "";
};

const createDoneTask = (taskName) => {
  renderTask(getTask(true, taskName));
};

const getTask = (isDone, name) => {
  return {
    isDone: isDone,
    name: name
  };
};

const renderTask = (task) => {
  const elements = getElements();
  setElementsClass(elements);
  setElementsData(elements, task);

  if (!task.isDone) todo.appendChild(elements.li);
  else done.appendChild(elements.li);

  elements.li.appendChild(elements.div);
  elements.div.appendChild(elements.deleteButton);
  elements.div.appendChild(elements.input);

  if (!task.isDone) todoElements.push(elements);
};

const getElements = () => {
  return {
    li: newElement("li"),
    div: newElement("div"),
    deleteButton: newElement("img"),
    input: newElement("input")
  };
};

const setElementsClass = (elements) => {
  elements.div.className = "task";
  elements.deleteButton.className = "deleteButton";
};

const setElementsData = (elements, task) => {
  elements.deleteButton.src =
    "https://www.svgrepo.com/show/6440/delete-button.svg";
  elements.deleteButton.addEventListener("click", () => {
    elements.li.remove();
  });

  elements.input.type = "text";
  elements.input.value = task.name;
};
