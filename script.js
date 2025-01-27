console.clear();

const $ = (className) => document.querySelector(className);
const $all = (className) => document.querySelectorAll(className);
const newElement = (elementName) => document.createElement(elementName);

const currentTodoNameH1 = $(".currentTodoNameH1");
const addTodoTaskInput = $(".addTodoTaskInput");

const cyclesLeftP = $(".cyclesLeftP");
const minutesH3 = $(".minutesH3");
const secondsH3 = $(".secondsH3");
const startButton = $(".startButton");
const stopButton = $(".stopButton");
const progressBar = $(".progressBar");

const darkBg = $(".darkBg");

const modal = $(".modal");
const pomodoroSettingsButton = $(".pomodoroSettingsButton");
const topBackground = $(".top");

const saveSettingsButton = $(".saveSettingsButton");
const closeSettingsButton = $(".closeSettingsButton");

const workInput = $(".workInput");
const shortBreakInput = $(".shortBreakInput");
const longBreakInput = $(".longBreakInput");
const longBreakDelayInput = $(".longBreakDelayInput");

const workDurationModalP = $(".workDurationModalP");
const shortBreakDurationModalP = $(".shortBreakDurationModalP");
const longBreakDurationModalP = $(".longBreakDurationModalP");
const longBreakDelayModalP = $(".longBreakDelayModalP");

const todoTaskUl = $(".todoTaskUl");
const doneTaskUl = $(".doneTaskUl");

// Audio Init
const endWorkAudio = newElement("audio");
endWorkAudio.src =
  "https://www.myinstants.com/media/sounds/aot-eyecatch-intermission-song-end.mp3";

const endBreakAudio = newElement("audio");
endBreakAudio.src = "https://www.myinstants.com/media/sounds/dararararaaa.mp3";

let todoTasks = [];
let timerInterval = null;

// Fake pomodoro structure to test a cycle in seconds
const getTestCycles = (longBreakDelay) => {
  const seconds = 4;
  const shortBreakSeconds = 3;
  const longBreakSeconds = 4;

  return {
    workTimer: {
      minutes: 0,
      seconds: seconds,
      elapsedSeconds: 0,
      totalSecondsDuration: seconds,
      isDone: false
    },
    shortBreakTimer: {
      minutes: 0,
      seconds: shortBreakSeconds,
      elapsedSeconds: 0,
      totalSecondsDuration: shortBreakSeconds,
      isDone: false
    },
    longBreakTimer: {
      minutes: 0,
      seconds: longBreakSeconds,
      elapsedSeconds: 0,
      totalSecondsDuration: longBreakSeconds,
      isDone: false
    },
    longBreakDelay: longBreakDelay,
    longBreakDelayMax: longBreakDelay
  };
};

//let pomodoro = getPomodoro(45, 10, 30, 4);
//setPomodoroModal(pomodoro);

pomodoro = getTestCycles(2);
const pomodoroDefault = getTestCycles(2);
cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;

// Start pomodoro button
startButton.addEventListener("click", () => {
  startButton.innerText =
    startButton.innerText !== "P A U S E" ? "P A U S E" : "S T A R T";

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!pomodoro.workTimer.isDone) updateTimer(pomodoro.workTimer);
    else if (pomodoro.longBreakDelay > 1) updateTimer(pomodoro.shortBreakTimer);
    else updateTimer(pomodoro.longBreakTimer);
  }, 1000);
});

const updateTimer = (timer) => {
  if (timer.seconds < 1 && timer.minutes > 0) {
    --timer.minutes;
    timer.seconds = 59;
  } else if (timer.seconds > 0) {
    --timer.seconds;
    ++timer.elapsedSeconds;
  } else {
    timer.isDone = true;

    if (pomodoro.shortBreakTimer.isDone) {
      pomodoro.longBreakDelay--;
      setWorkCycle();
    } else if (pomodoro.longBreakTimer.isDone) {
      setWorkCycle();
      pomodoro.longBreakDelay = pomodoro.longBreakDelayMax;
    } else if (pomodoro.workTimer.isDone) {
      const typeBreak = pomodoro.longBreakDelay > 1 ? "Short " : "Long ";
      setBreakCycle(typeBreak);
    }
  }

  setProgressBar(timer);
  if (startButton.innerText === "S T A R T") clearInterval(timerInterval);
  else setFrontTimer(timer);
};

const setBreakCycle = (typeBreak) => {
  endWorkAudio.pause();
  endBreakAudio.play();

  currentTodoNameH1.innerText = typeBreak + "Break Time!";
  topBackground.style.background = "green";
  stopButton.innerText = "S K I P";

  const doneTaskName = todoTasks.length > 0 ? todoTasks[0].nameInput.value : "";
  createTask(true, doneTaskName);
  removeFirstTodoTask();
  console.log("after work time  ");
  console.log(pomodoro);
};

const removeFirstTodoTask = () => {
  if (todoTasks.length > 0) {
    todoTasks[0].li.remove();
    todoTasks.shift();
  }
};

const setWorkCycle = () => {
  endBreakAudio.pause();
  endWorkAudio.play();

  startButton.innerText = "S T A R T";
  stopButton.innerText = "S T O P";
  topBackground.style.background = "#863735";
  cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;
  currentTodoNameH1.innerText =
    todoTasks.length > 0 ? todoTasks[0].nameInput.value : "";

  pomodoro = resetTimers();
  setFrontTimer(pomodoro.workTimer);
  clearInterval(timerInterval);

  console.log("after break time " + pomodoro);
  console.log(pomodoro);
};

const resetTimers = () => {
  if (pomodoro.longBreakDelay < 1)
    pomodoro.longBreakDelay = pomodoro.longBreakDelayMax;

  return {
    ...pomodoroDefault,
    longBreakDelay: pomodoro.longBreakDelay
  };
};

// Stop pomodoro button
stopButton.addEventListener("click", () => {
  if (stopButton.innerText === "S K I P") {
    stopButton.innerText = "S T O P";
    topBackground.style.background = "#863735";
  }

  clearInterval(timerInterval);

  startButton.innerText = "S T A R T";
  pomodoro = { ...pomodoro, workTimer: pomodoroDefault.workTimer };
  setFrontTimer(pomodoro);
});

const setProgressBar = (timer) => {
  const progressPercentage =
    ((timer.totalSecondsDuration - timer.elapsedSeconds) /
      timer.totalSecondsDuration) *
    100;
  progressBar.style.width = `${progressPercentage}%`;
  if (progressBar.style.width === "0%") progressBar.style.width = "100%";
};

// Tasks
addTodoTaskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  createTask(false, addTodoTaskInput.value);
  currentTodoNameH1.innerText = addTodoTaskInput.value;
  addTodoTaskInput.value = "";
});

const createTask = (isDone, taskName) => {
  renderTask(getTask(isDone, taskName));
};

const getTask = (isDone, name) => {
  return {
    isDone: isDone,
    name: name
  };
};

const renderTask = (task) => {
  const elementsTask = getElementsTask();
  setElementsClass(elementsTask, task.isDone);
  setElementsData(elementsTask, task);

  if (!task.isDone) todoTaskUl.appendChild(elementsTask.li);
  else doneTaskUl.appendChild(elementsTask.li);

  elementsTask.li.appendChild(elementsTask.div);
  elementsTask.div.appendChild(elementsTask.nameInput);
  elementsTask.div.appendChild(elementsTask.deleteButton);
  elementsTask.div.appendChild(elementsTask.startTaskButton);

  if (!task.isDone) todoTasks.push(elementsTask);
};

const getElementsTask = () => {
  return {
    li: newElement("li"),
    div: newElement("div"),
    deleteButton: newElement("img"),
    nameInput: newElement("input"),
    startTaskButton: newElement("img")
  };
};

const setElementsClass = (elementsTask, isDone) => {
  elementsTask.div.className = "task";
  elementsTask.nameInput.className = "inputNameTask";
  elementsTask.deleteButton.className = "deleteButton";
  elementsTask.startTaskButton.className = "startTaskButton";
};

const setElementsData = (elementsTask, task) => {
  elementsTask.deleteButton.src =
    "https://www.svgrepo.com/show/6440/delete-button.svg";
  elementsTask.deleteButton.addEventListener("click", () => {
    elementsTask.li.remove();
  });

  elementsTask.nameInput.type = "text";
  elementsTask.nameInput.value = task.name;

  elementsTask.startTaskButton.src =
    "https://www.svgrepo.com/show/312860/play-button.svg";
  elementsTask.startTaskButton.addEventListener("click", () => {
    currentTodoTaskH1.innerText = task.name;
    console.log("Todo: Put " + task.name + " first into the list");
    //todoTasks.forEach();
    // put it first into the list, not in the dom, like that It will still remove him in the dom and create the done task
    // parse the list to find the index of the task then change his position in the list for it to be first // TEST TODO
  });

  elementsTask.startTaskButton.style.visibility = task.isDone
    ? "hidden"
    : "default";
};

const getPomodoro = (
  workInputValue,
  shortBreakInputValue,
  longBreakInputValue,
  longBreakDelayInputValue
) => {
  const workAmount = parseInt(workInputValue);
  const shortBreakAmount = parseInt(shortBreakInputValue);
  const longBreakAmount = parseInt(longBreakInputValue);
  const longBreakDelay = parseInt(longBreakDelayInputValue);

  return {
    workTimer: getTimer(workAmount),
    shortBreakTimer: getTimer(shortBreakAmount),
    longBreakTimer: getTimer(longBreakAmount),
    longBreakDelay: longBreakDelay,
    longBreakDelayMax: longBreakDelay
  };
};

const getTimer = (minutes) => {
  return {
    minutes: minutes,
    seconds: 0,
    isDone: false,
    elapsedSeconds: 0,
    totalSecondsDuration: minutes * 60
  };
};

const setPomodoroModal = (pomodoro) => {
  workDurationModalP.innerText = pomodoro.workTimer.minutes;
  shortBreakDurationModalP.innerText = pomodoro.shortBreakTimer.minutes;
  longBreakDurationModalP.innerText = pomodoro.longBreakTimer.minutes;
  longBreakDelayModalP.innerText = pomodoro.longBreakDelay;
};

const setFrontTimer = (timer) => {
  minutesH3.innerText =
    timer.minutes < 10
      ? "0" + timer.minutes.toString()
      : timer.minutes.toString();
  secondsH3.innerText =
    timer.seconds < 10
      ? "0" + timer.seconds.toString()
      : timer.seconds.toString();
};

setPomodoroModal(pomodoro);
setFrontTimer(pomodoro.workTimer);

// Modal
pomodoroSettingsButton.addEventListener("click", () => {
  modal.style.display = "flex";
  darkBg.style.display = "inline-block";
});

closeSettingsButton.addEventListener("click", () => {
  modal.style.display = "none";
  darkBg.style.display = "none";
});

saveSettingsButton.addEventListener("click", () => {
  const inputsModal = [
    workInput,
    shortBreakInput,
    longBreakInput,
    longBreakDelayInput
  ];
  const isInvalid = inputsModal.some(
    (inputModal) =>
      inputModal.value === "" ||
      parseInt(inputModal.value) === 0 ||
      isNaN(inputModal.value)
  );

  if (isInvalid) return;

  const newPomodoro = getPomodoro(
    workInput.value,
    shortBreakInput.value,
    longBreakInput.value,
    longBreakDelayInput.value
  );

  setPomodoroModal(newPomodoro);
  setFrontTimer(newPomodoro.workTimer);
  pomodoro = newPomodoro;
});
