console.clear();

const $ = (className) => document.querySelector(className);
const $all = (className) => document.querySelectorAll(className);
const newElement = (elementName) => document.createElement(elementName);

const titlePomodoro = $(".titlePomodoro");
const addTodoTaskInput = $(".addTodoTaskInput");

const minutesH3 = $(".minutesH3");
const secondsH3 = $(".secondsH3");
const startButton = $(".startButton");
const stopButton = $(".stopButton");

const darkBg = $(".darkBg");

const modal = $(".modal");
const settingsButton = $(".settingsButton");
const topBackground = $(".top");

const saveSettingsButton = $(".saveSettingsButton");
const closeSettingsButton = $(".closeSettingsButton");

const workInput = $(".workInput");
const shortBreakInput = $(".shortBreakInput");
const longBreakInput = $(".longBreakInput");
const longBreakDelayInput = $(".longBreakDelayInput");

const workP = $(".workP");
const shortBreakP = $(".shortBreakP");
const longBreakP = $(".longBreakP");
const longBreakDelayP = $(".longBreakDelayP");

const todo = $(".todo");
const done = $(".done");

let todoTasks = [];
let interval = null;

const setPomodoroModal = (pomodoro) => {
  workP.innerText = pomodoro.workTimer.minutes;
  shortBreakP.innerText = pomodoro.shortBreaktTimer.minutes;
  longBreakP.innerText = pomodoro.longBreakTimer.minutes;
  longBreakDelayP.innerText = pomodoro.longBreakDelay;
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
    shortBreaktTimer: getTimer(shortBreakAmount),
    longBreakTimer: getTimer(longBreakAmount),
    longBreakDelay: longBreakDelay,
    longBreakDelayMax: longBreakDelay
  };
};

const getTimer = (minutes) => {
  return {
    minutes: parseInt(minutes),
    seconds: 0,
    isDone: false
  };
};

let pomodoro = getPomodoro(45, 10, 30, 4);
setPomodoroModal(pomodoro);

const getDefaultWorkTime = () => {
  return {
    minutes: parseInt(workP.innerText),
    seconds: 0,
    isDone: false
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
settingsButton.addEventListener("click", () => {
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

// Pomodoro timer
startButton.addEventListener("click", () => {
  startButton.innerText =
    startButton.innerText !== "P A U S E" ? "P A U S E" : "S T A R T";

  clearInterval(interval);
  interval = setInterval(() => {
    if (!pomodoro.workTimer.isDone) {
      updateTimer(pomodoro.workTimer);
    } else if (pomodoro.longBreakDelay > 1) {
      topBackground.style.background = "green";
      stopButton.innerText = "S K I P";
      updateTimer(pomodoro.shortBreakTimer);
    } else {
      // Create Done task
      const doneTaskName = todoTasks.length > 0 ? todoTasks[0].nameInput.value : "";
      createTask(true, doneTaskName);

      // Remove most recent todo task
      if (todoTasks.length > 0) {
        todoTasks[0].li.remove();
        todoTasks.shift();
      }

      titlePomodoro.innerText =
        todoTasks.length > 0 ? todoTasks[0].nameInput.value : "";
      clearInterval(interval);

      updateTimer(pomodoro.longBreakTimer);
    }
  }, 1000);
});

const updateTimer = (timer) => {
  if (timer.seconds < 1 && timer.minutes > 0) {
    --timer.minutes;
    timer.seconds = 59;
  } else if (timer.seconds > 0) {
    --timer.seconds;
  } else {
    // Timer finished
    timer.isDone = true;
  }

  if (startButton.innerText === "S T A R T") clearInterval(interval);
  else setFrontTimer(timer);
};

stopButton.addEventListener("click", () => {
  if (stopButton.innerText === "S K I P") {
    stopButton.innerText = "S T O P";
    topBackground.style.background = "#863735";
  }

  setFrontTimer(getDefaultWorkTime());
  startButton.innerText = "S T A R T";
  clearInterval(interval);
});

addTodoTaskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  createTask(false, addTodoTaskInput.value);
  titlePomodoro.innerText = addTodoTaskInput.value;
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
  const elements = getElements();
  setElementsClass(elements);
  setElementsData(elements, task);

  if (!task.isDone) todo.appendChild(elements.li);
  else done.appendChild(elements.li);

  elements.li.appendChild(elements.div);
  elements.div.appendChild(elements.deleteButton);
  elements.div.appendChild(elements.nameInput);

  if (!task.isDone) todoTasks.push(elements);
};

const getElements = () => {
  return {
    li: newElement("li"),
    div: newElement("div"),
    deleteButton: newElement("img"),
    nameInput: newElement("input")
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

  elements.nameInput.type = "text";
  elements.nameInput.value = task.name;
};
