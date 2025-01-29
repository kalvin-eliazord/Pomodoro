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
const shortBreakAudio = $(".shortBreakAudio");
const longBreakAudio = $(".longBreakAudio");
const idleAudio = $(".idleAudio");
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

pomodoro = getTestPomodoroCycle(4);
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
  toggleTaskStartPomodoroBtn(pomodoro.cycleState);

  switch (newState) {
    case "inProgress":
      startTimer();
      break;
    case "paused":
      clearInterval(pomodoro.timerId);
      break;
    case "done":
      prepareNextTimer();
      break;
    default:
      console.log("State undefined.");
      break;
  }

  setButtonsText();
};

const toggleTaskStartPomodoroBtn = (pomodoroState) => {
  todoTasks.forEach((todoTask) => {
    todoTask.startTodoButton.style.visibility =
      pomodoroState === "inProgress" ? "hidden" : "visible";
  });
};

const startTimer = () => {
  pomodoro.timerId = setInterval(() => {
    let timer = getCurrentTimer();
    if (timer.secondsLeft > 1) {
      --timer.secondsLeft;
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
  stopButton.style.visibility =
    pomodoro.cycleState !== "idle" ? "visible" : "hidden";

  stopButton.innerText =
    pomodoro.currentTimer === "work" ? "D O N E" : "S K I P";

  startButton.innerText =
    pomodoro.cycleState === "paused" || pomodoro.cycleState === "idle"
      ? "S T A R T"
      : "P A U S E";
};

const prepareNextTimer = () => {
  if (pomodoro.currentTimer === "work") {
    const typeBreak = pomodoro.longBreakDelay > 1 ? "Short" : "Long";

    if (typeBreak === "Short") {
      pomodoro.currentTimer = "shortBreak";
      pomodoro.longBreakDelay--;
    } else {
      pomodoro.currentTimer = "longBreak";
      pomodoro.longBreakDelay = pomodoro.longBreakDelayMax;
    }

    setBreakUI(typeBreak);
    createDoneTask();
  } else {
    pomodoro.cycleState = "idle";
    pomodoro.currentTimer = "work";
    setWorkUI();
    clearInterval(pomodoro.timerId);
  }

  resetTimers();
};

const showConfetti = () => {
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
  );
};

const createDoneTask = () => {
  createTask(true, todoTasks[0].taskNameInput.value);
  removeFirstTodoTask();
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

const removeFirstTodoTask = () => {
  if (todoTasks.length > 0) {
    todoTasks[0].li.remove();
    todoTasks.shift();
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
  currentTodoNameH1.innerText =
    todoTasks.length > 0 ? todoTasks[0].taskNameInput.value : "";
  topBackground.style.background = "#863735";
  startButton.style.visibility = "hidden";
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
  pomodoro.cycleState = "idle";
  setButtonsText();
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
  });

  elementsTask.taskNameInput.type = "text";
  elementsTask.taskNameInput.value = task.name;

  elementsTask.startTodoButton.src =
    "https://www.svgrepo.com/show/312860/play-button.svg";
  elementsTask.startTodoButton.addEventListener("click", () => {
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
    cycle: "idle",
    currentTimer: "work",
    timerId: null
  };
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
    parseInt(workInput.value),
    parseInt(shortBreakInput.value),
    parseInt(longBreakInput.value),
    parseInt(longBreakDelayInput.value)
  );

  setPomodoroModal(savedPomodoro);
  pomodoroDefault = structuredClone(savedPomodoro);
  pomodoro = structuredClone(savedPomodoro);
  updateUI(getCurrentTimer());
});

const setPomodoroModal = (savedPomodoro) => {
  workDurationModalP.innerText = Math.floor(
    savedPomodoro.workTimer.secondsLeft / 60
  );
  shortBreakDurationModalP.innerText = Math.floor(
    savedPomodoro.shortBreakTimer.secondsLeft / 60
  );
  longBreakDurationModalP.innerText = Math.floor(
    savedPomodoro.longBreakTimer.secondsLeft / 60
  );
  longBreakDelayModalP.innerText = savedPomodoro.longBreakDelay;
  cyclesLeftP.innerText = `${savedPomodoro.longBreakDelay} pomodoro before long break.`;
};

setPomodoroModal(pomodoro);
updateUI(getCurrentTimer());
