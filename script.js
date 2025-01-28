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
const endWorkAudio = $(".endWorkAudio");
const endBreakAudio = $(".endBreakAudio");

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
    longBreakDelayMax: longBreakDelay,
    cycleState: null,
    oldCycleState: null
  };
};

//let pomodoro = getPomodoro(45, 10, 30, 4);
//setPomodoroModal(pomodoro);

const pomodoroDefault = getTestCycles(4);
pomodoro = structuredClone(pomodoroDefault);
cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;

// Start pomodoro button
startButton.addEventListener("click", () => {
  console.log("pomodoro startButton");
  console.log(pomodoro);

  pomodoro.oldCycleState = !pomodoro.oldCycleState ? pomodoro.cycleState : null;
  pomodoro.cycleState = !pomodoro.oldCycleState ? "inProgress" : "paused";
  toggleTaskStartTimerBtn(pomodoro.cycleState);

  clearInterval(timerInterval);
  timerInterval = startPomodoro(pomodoro);
});

const toggleTaskStartTimerBtn = (pomodoroState) => {
  todoTasks.forEach((todoTask) => {
    todoTask.startTodoButton.style.visibility =
      pomodoroState === "inProgress" ? "hidden" : "visible";
  });
};

const startPomodoro = (pomodoro) => {
  return setInterval(() => {
    if (!pomodoro.workTimer.isDone)
      handlePomodoroState(pomodoro.workTimer, pomodoro);
    else if (!pomodoro.shortBreakTimer.isDone && pomodoro.longBreakDelay > 1)
      handlePomodoroState(pomodoro.shortBreakTimer, pomodoro);
    else handlePomodoroState(pomodoro.longBreakTimer, pomodoro);
  }, 1000);
};

const handlePomodoroState = (timer, pomodoro) => {
  console.log("CycleState: " + pomodoro.cycleState);
  switch (pomodoro.cycleState) {
    case "inProgress":
      updateTimer(timer, pomodoro);
      pomodoro.oldCycleState = pomodoro.cycleState;
      setButtonsText(pomodoro);
      break;

    case "paused":
      setButtonsText(pomodoro);
      clearInterval(timerInterval);
      break;

    case "done":
      pomodoro = getResetTimers(pomodoro);
      setFrontTimer(pomodoro.workTimer);
      setButtonsText(pomodoro);
      clearInterval(timerInterval);
      console.log(pomodoro);
      break;

    default:
      console.log("Pomodoro cycle state undefined.");
      break;
  }

  setFrontTimer(timer);
  setProgressBar(timer);
};

const updateTimer = (timer, pomodoro) => {
  if (timer.seconds < 1 && timer.minutes > 0) {
    --timer.minutes;
    timer.seconds = 59;
  } else if (timer.seconds > 0) {
    --timer.seconds;
    ++timer.elapsedSeconds;
  } else {
    setNextTimer(timer, pomodoro);
  }
};

const setButtonsText = (pomodoro) => {
  stopButton.style.visibility = !pomodoro.oldCycleState ? "hidden" : "visible";
  stopButton.innerText = pomodoro.workTimer.isDone ? "S K I P" : "D O N E";

  startButton.innerText =
    pomodoro.cycleState === "inProgress" ? "P A U S E" : "S T A R T";
};

const setNextTimer = (timer, pomodoro) => {
  timer.isDone = true;

  if (pomodoro.shortBreakTimer.isDone) {
    setWorkTimer(pomodoro);
  } else if (pomodoro.longBreakTimer.isDone) {
    pomodoro.longBreakDelay = pomodoro.longBreakDelayMax;
    setWorkTimer(pomodoro);
  } else if (pomodoro.workTimer.isDone) {
    const typeBreak = pomodoro.longBreakDelay > 1 ? "Short " : "Long ";
    setBreakTimer(typeBreak);
    if (pomodoro.longBreakDelay > 1) --pomodoro.longBreakDelay;

    cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;
  }
};

const setBreakTimer = (typeBreak) => {
  endWorkAudio.pause();
  endBreakAudio.play();
  setBreakTimerStyle(typeBreak);
  createDoneTask();
};

const setBreakTimerStyle = (typeBreak) => {
  currentTodoNameH1.innerText = typeBreak + "Break Time!";
  topBackground.style.background = "green";
  progressBar.style.width = "100%";
};

const createDoneTask = () => {
  const doneTaskName =
    todoTasks.length > 0 ? todoTasks[0].taskNameInput.value : "";
  createTask(true, doneTaskName);
  removeFirstTodoTask();
};

const removeFirstTodoTask = () => {
  if (todoTasks.length > 0) {
    todoTasks[0].li.remove();
    todoTasks.shift();
  }
};

const setWorkTimer = (pomodoro) => {
  endBreakAudio.pause();
  endWorkAudio.play();

  currentTodoNameH1.innerText =
    todoTasks.length > 0 ? todoTasks[0].taskNameInput.value : "";
  startButton.innerText = "S T A R T";
  stopButton.innerText = "S T O P";
  topBackground.style.background = "#863735";
  progressBar.style.width = "100%";

  pomodoro.cycleState = "done";
};

const getResetTimers = (pomodoro) => {
  return {
    ...structuredClone(pomodoroDefault),
    longBreakDelay: pomodoro.longBreakDelay
  };
};

// Stop pomodoro button
stopButton.addEventListener("click", () => {
  pomodoro.cycleState =
    pomodoro.cycleState === "workInProgress" ? "workStopped" : "workDone";
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
  currentTodoNameH1.innerText = todoTasks[0].taskNameInput.value;
  addTodoTaskInput.value = "";
});

const createTask = (isDone, taskName) => {
  renderTask(getTask(isDone, taskName));
};

const getTask = (isDone, name) => {
  return {
    id: todoTasks.length,
    isDone: isDone,
    name: name
  };
};

const renderTask = (task) => {
  const elementsTask = getElementsTask(task.id);
  setElementsClass(elementsTask, task.isDone);
  setElementsData(elementsTask, task);

  if (!task.isDone) todoTaskUl.appendChild(elementsTask.li);
  else doneTaskUl.appendChild(elementsTask.li);

  elementsTask.li.appendChild(elementsTask.div);
  elementsTask.div.appendChild(elementsTask.taskNameInput);
  elementsTask.div.appendChild(elementsTask.deleteButton);
  elementsTask.div.appendChild(elementsTask.startTodoButton);

  if (!task.isDone) todoTasks.push(elementsTask);
};

const getElementsTask = (id) => {
  return {
    id: id,
    li: newElement("li"),
    div: newElement("div"),
    deleteButton: newElement("img"),
    taskNameInput: newElement("input"),
    startTodoButton: newElement("img")
  };
};

const setElementsClass = (elementsTask, isDone) => {
  elementsTask.div.className = "task";
  elementsTask.taskNameInput.className = "inputNameTask";
  elementsTask.deleteButton.className = "deleteButton";
  elementsTask.startTodoButton.className = "startTodoButton";
};

const setElementsData = (elementsTask, task) => {
  elementsTask.deleteButton.src =
    "https://www.svgrepo.com/show/6440/delete-button.svg";
  elementsTask.deleteButton.addEventListener("click", () => {
    elementsTask.li.remove();
  });

  elementsTask.taskNameInput.type = "text";
  elementsTask.taskNameInput.value = task.name;

  elementsTask.startTodoButton.src =
    "https://www.svgrepo.com/show/312860/play-button.svg";
  elementsTask.startTodoButton.addEventListener("click", () => {
    timerInterval = startPomodoro();
    setTaskFirstPriority(todoTasks, task);
  });

  elementsTask.startTodoButton.style.visibility = task.isDone
    ? "hidden"
    : "default";
};

const setTaskFirstPriority = (todoTasks, task) => {
  if (todoTasks[0].id === task.id) return;

  currentTodoNameH1.innerText = task.name;
  todoTasks.forEach((todoTask, i) => {
    if (todoTask.id === task.id) {
      todoTasks.splice(i, 1);
      todoTasks.splice(0, 0, elementsTask);
    }
  });
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

  const savedPomodoro = getPomodoro(
    workInput.value,
    shortBreakInput.value,
    longBreakInput.value,
    longBreakDelayInput.value
  );

  setPomodoroModal(savedPomodoro);
  setFrontTimer(savedPomodoro.workTimer);
  pomodoro = savedPomodoro;
});

const setPomodoroModal = (pomodoro) => {
  workDurationModalP.innerText = pomodoro.workTimer.minutes;
  shortBreakDurationModalP.innerText = pomodoro.shortBreakTimer.minutes;
  longBreakDurationModalP.innerText = pomodoro.longBreakTimer.minutes;
  longBreakDelayModalP.innerText = pomodoro.longBreakDelay;
  cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;
};

setPomodoroModal(pomodoro);
setFrontTimer(pomodoro.workTimer);
