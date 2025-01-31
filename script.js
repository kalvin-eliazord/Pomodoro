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
const modalSettings = $(".modalSettings");
const pomodoroSettingsButton = $(".pomodoroSettingsBtnParent");
const topBackground = $(".top");
const saveSettingsButton = $(".saveSettingsButton");
const closeSettingsButton = $(".closeSettingsButton");
const noButton = $(".noButton");
const yesButton = $(".yesButton");
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
const shortBreakAudio = $(".shortBreakAudio");
const longBreakAudio = $(".longBreakAudio");
const idleAudio = $(".idleAudio");
const modalCongratulation = $(".modalCongratulation");
const congratulationP = $(".congratulationP");

let todoTasks = [];

// Pomodoro settings to test the timer in seconds instead of minutes
const getTestPomodoroCycle = (longBreakDelay) => {
  const seconds = 4;
  const shortBreakSeconds = 3;
  const longBreakSeconds = 4;

  return {
    workTimer: {
      secondsLeft: seconds,
      totalSeconds: seconds,
      isDone: false
    },
    shortBreakTimer: {
      secondsLeft: shortBreakSeconds,
      totalSeconds: shortBreakSeconds,
      isDone: false
    },
    longBreakTimer: {
      secondsLeft: longBreakSeconds,
      totalSeconds: longBreakSeconds,
      isDone: false
    },
    longBreakDelay: longBreakDelay,
    longBreakDelayMax: longBreakDelay,

    cycleState: "idle",
    currentTimer: "work",
    timerId: null
  };
};

let pomodoro = getTestPomodoroCycle(4);
let pomodoroDefault = structuredClone(pomodoro);

// Start pomodoro button
startButton.addEventListener("click", () => {
  clearInterval(pomodoro.timerId);

  if (pomodoro.cycleState === "idle" || pomodoro.cycleState === "paused")
    handleState("inProgress");
  else handleState("paused");
});

const handleState = (newState) => {
  pomodoro.cycleState = newState;

  switch (newState) {
    case "inProgress":
      startTimer();
      break;
    case "paused":
      clearInterval(pomodoro.timerId);
      pomodoro.timerId = null;
      break;
    case "done":
      prepareNextTimer();
      stopCycle();
      break;
    default:
      console.log("State undefined.");
      break;
  }

  setButtonsText();
};

const startTimer = () => {
  pomodoro.timerId = setInterval(() => {
    let timer = getCurrentTimer();
    if (timer.secondsLeft > 1) {
      timer.secondsLeft--;
      updateUI(timer);
    } else {
      handleState("done");
    }
  }, 1000);
};

const getCurrentTimer = () => {
  switch (pomodoro.currentTimer) {
    case "work":
      return pomodoro.workTimer;
    case "shortBreak":
      return pomodoro.shortBreakTimer;
    case "longBreak":
      return pomodoro.longBreakTimer;
  }
};

const updateUI = (timer) => {
  minutesH3.innerText = Math.floor(timer.secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  secondsH3.innerText = (timer.secondsLeft % 60).toString().padStart(2, "0");

  progressBar.style.width = `${
    (timer.secondsLeft / timer.totalSeconds) * 100
  }%`;

  cyclesLeftP.innerText = `${pomodoro.longBreakDelay} pomodoro before long break.`;
};

const setButtonsText = () => {
  toggleTaskStartPomodoroBtn();

  stopButton.style.visibility =
    pomodoro.cycleState !== "idle" ? "visible" : "hidden";

  stopButton.innerText =
    pomodoro.currentTimer === "work" ? "D O N E" : "S K I P";

  startButton.innerText =
    pomodoro.cycleState === "inProgress" || pomodoro.cycleState === "done"
      ? "P A U S E"
      : "S T A R T";
};

const toggleTaskStartPomodoroBtn = () => {
  todoTasks.forEach((todoTask) => {
    todoTask.startTodoButton.style.visibility =
      pomodoro.cycleState === "inProgress" ||
      pomodoro.currentTimer !== "work" ||
      pomodoro.cycleState === "done"
        ? "hidden"
        : "visible";
  });
};

const prepareNextTimer = () => {
  if (pomodoro.currentTimer === "work") {
    const typeBreak = pomodoro.longBreakDelay > 1 ? "Short" : "Long";

    if (typeBreak === "Short") {
      pomodoro.currentTimer = "shortBreak";
      pomodoro.longBreakDelay--;
    } else {
      renderConfetti(35);
      toggleCongratulationModal();
      pomodoro.currentTimer = "longBreak";
      pomodoro.longBreakDelay = pomodoro.longBreakDelayMax;
    }

    setBreakUI(typeBreak);
  } else {
    pomodoro.currentTimer = "work";
    setWorkUI();
  }

  resetTimers();
};

const stopCycle = () => {
  if (
    pomodoro.longBreakDelay === pomodoro.longBreakDelayMax &&
    pomodoro.currentTimer === "work"
  ) {
    pomodoro.cycleState = "idle";
    setButtonsText();
    clearInterval(pomodoro.timerId);
  }
};

const renderConfetti = (numberConfetti) => {
  for (i = 0; i < numberConfetti; i++) {
    const confetti = newElement("div");
    confetti.className = "confetti";
    document.body.appendChild(confetti);
    confetti.style.left = `${getRandomRange(5, 95)}%`;
    confetti.style.top = `${getRandomRange(0, 10)}%`;
    confetti.style.background = `hsl(${getRandomRange(0, 360)}, 100%, 50%)`;
    confetti.style.transform = `translateX(${getRandomRange(-100, 200)}px)`;
    confetti.style.animation = `fall ${getRandomRange(
      2,
      5
    )}s ease-out forwards`;
  }
};

const getRandomRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

yesButton.addEventListener("click", () => {
  toggleCongratulationModal();
  for (i = 0; i < todoTasks.length; ++i) createDoneTask(i);
  removeTodoTasks();
});

noButton.addEventListener("click", () => {
  toggleCongratulationModal();
});

const toggleCongratulationModal = () => {
  if (modalCongratulation.style.display !== "inline-block") {
    cyclesLeftP.style.visibility = "hidden";
    darkBg.style.display = "inline-block";
    modalCongratulation.style.display = "inline-block";
    modalCongratulation.focus();
  } else {
    darkBg.style.display = "none";
    modalCongratulation.style.display = "none";
    modalCongratulation.blur();
  }
};

const createDoneTask = (i) => {
  createTask(true, todoTasks[i].taskNameInput.value);
};

const createTask = (isDone, taskName) => {
  if (startButton.style.visibility !== "visible")
    startButton.style.visibility = "visible";

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

const removeTodoTasks = () => {
  if (todoTasks.length > 0) {
    todoTasks.forEach((todoTask) => {
      todoTask.li.remove();
    });
    todoTasks.length = 0;
  }
};

const setBreakUI = (typeBreak) => {
  currentTodoNameH1.innerText = typeBreak + " Break Time!";
  topBackground.style.background = "green";

  if (typeBreak === "Short") shortBreakAudio.play();
  else longBreakAudio.play();
};

const setWorkUI = () => {
  idleAudio.play();
  cyclesLeftP.style.visibility = "visible";
  currentTodoNameH1.innerText =
    todoTasks.length > 0 ? todoTasks[0].taskNameInput.value : "";
  topBackground.style.background = "#863735";
  if (todoTasks.length < 1) startButton.style.visibility = "hidden";
};

const resetTimers = () => {
  pomodoro = {
    ...structuredClone(pomodoroDefault),
    cycleState: pomodoro.cycleState,
    timerId: pomodoro.timerId,
    currentTimer: pomodoro.currentTimer,
    longBreakDelay: pomodoro.longBreakDelay
  };
  updateUI(getCurrentTimer());
};

// Stop pomodoro button
stopButton.addEventListener("click", () => {
  handleState("done");
  if (!pomodoro.timerId) handleState("inProgress");
});

// Task creation
addTodoTaskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  createTask(false, addTodoTaskInput.value);
  currentTodoNameH1.innerText = todoTasks[0].taskNameInput.value;
  addTodoTaskInput.value = "";
});

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
    todoTasks.splice(task.id, 1);
    if (todoTasks.length < 1) {
      startButton.style.visibility = "hidden";
      currentTodoNameH1.innerText = "Start by creating a new task 🍅";
    }
  });

  elementsTask.taskNameInput.type = "text";
  elementsTask.taskNameInput.value = task.name;

  elementsTask.startTodoButton.src =
    "https://www.svgrepo.com/show/312860/play-button.svg";
  elementsTask.startTodoButton.addEventListener("click", () => {
    clearInterval(pomodoro.timerId);
    handleState("inProgress");
    setTaskFirstPriority(todoTasks, task);
  });

  elementsTask.startTodoButton.style.visibility = task.isDone
    ? "hidden"
    : "visible";
};

const setTaskFirstPriority = (todoTasks, task) => {
  if (todoTasks[0].id === task.id) return;

  currentTodoNameH1.innerText = task.name;
  todoTasks.forEach((todoTask, i) => {
    if (todoTask.id === task.id) {
      todoTasks.splice(i, 1);
      todoTasks.splice(0, 0, todoTask);
    }
  });
};

const getPomodoro = (
  workMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  longBreakDelay
) => {
  const workSeconds = Math.floor(workMinutes * 60);
  const shortBreakSeconds = Math.floor(shortBreakMinutes * 60);
  const longBreakSeconds = Math.floor(longBreakMinutes * 60);

  return {
    workTimer: {
      secondsLeft: workSeconds,
      totalSeconds: workSeconds,
      isDone: false
    },
    shortBreakTimer: {
      secondsLeft: shortBreakSeconds,
      totalSeconds: shortBreakSeconds,
      isDone: false
    },
    longBreakTimer: {
      secondsLeft: longBreakSeconds,
      totalSeconds: longBreakSeconds,
      isDone: false
    },
    longBreakDelay: longBreakDelay,
    longBreakDelayMax: longBreakDelay,
    cycleState: "idle",
    currentTimer: "work",
    timerId: null
  };
};

// Modal Settings
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

  const savedPomodoroSettings = getPomodoro(
    parseInt(workInput.value),
    parseInt(shortBreakInput.value),
    parseInt(longBreakInput.value),
    parseInt(longBreakDelayInput.value)
  );

  setPomodoroSettings(savedPomodoroSettings);
  pomodoroDefault = structuredClone(savedPomodoroSettings);
  pomodoro = structuredClone(savedPomodoroSettings);
  updateUI(getCurrentTimer());
  toggleSettingsModal();
  clearInterval(pomodoro.timerId);
});

closeSettingsButton.addEventListener("click", () => {
  toggleSettingsModal();
});

const setPomodoroSettings = (savedPomodoroSettings) => {
  workDurationModalP.innerText = Math.floor(
    savedPomodoroSettings.workTimer.secondsLeft / 60
  );
  shortBreakDurationModalP.innerText = Math.floor(
    savedPomodoroSettings.shortBreakTimer.secondsLeft / 60
  );
  longBreakDurationModalP.innerText = Math.floor(
    savedPomodoroSettings.longBreakTimer.secondsLeft / 60
  );
  longBreakDelayModalP.innerText = savedPomodoroSettings.longBreakDelay;
  cyclesLeftP.innerText = `${savedPomodoroSettings.longBreakDelay} pomodoro before long break.`;
};

const toggleSettingsModal = () => {
  if (modalSettings.style.display !== "flex") {
    darkBg.style.display = "inline-block";
    modalSettings.style.display = "flex";
    modalSettings.focus();
  } else {
    darkBg.style.display = "none";
    modalSettings.style.display = "none";
    modalSettings.blur();
  }
};

pomodoroSettingsButton.addEventListener("click", () => {
  toggleSettingsModal();
});

setPomodoroSettings(pomodoro);
updateUI(getCurrentTimer());
