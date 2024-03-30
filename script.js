const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const textArea = document.querySelector(".textArea-cont");
let modalPriorityColor = "black"; // Default to black
const removeBtn = document.querySelector(".remove-btn");
const allTickets = document.querySelectorAll(".ticket-cont");
const colors = ["lightpink", "lightgreen", "lightblue", "black"];
const toolboxColors = document.querySelectorAll(".color");
let ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];

let addTaskFlag = false;
let removeTaskFlag = false;
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";

addBtn.addEventListener("click", function () {
  // Display the model
  addTaskFlag = !addTaskFlag;

  if (addTaskFlag == true) {
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

removeBtn.addEventListener("click", function () {
  removeTaskFlag = !removeTaskFlag; // Toggle the removeTaskFlag when the button is clicked

  if (removeTaskFlag) {
    alert("Delete button is activated.");
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

modalCont.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key === "Shift") {
    const taskContent = textArea.value; // Get the content from the textarea
    // Generates a 6-character ID

    // const ticketID = Math.random().toString(36).substring(2, 8);
    let ticketID = shortid();
    createTicket(modalPriorityColor, taskContent, ticketID); // Create a new ticket with the selected color and task content
    modalCont.style.display = "none"; // Hide the modal
    addTaskFlag = false; // Set the addTaskFlag to false
    textArea.value = ""; // Clear the textarea's content
    ticketsArr.push({ ticketID, taskContent, ticketColor: modalPriorityColor });
    updateLocalStorage();
  }
});

function init() {
  if (localStorage.getItem("tickets")) {
    ticketsArr.forEach(function (ticket) {
      createTicket(ticket.ticketColor, ticket.taskContent, ticket.ticketID);
    });
  }
}

init();

function handleRemoval(ticket) {
  const id = ticket.querySelector(".ticket-id").innerText;

  ticket.addEventListener("click", function () {
    if (!removeTaskFlag) return;
    else {
      ticket.remove();
      const ticketIdx = getTicketIdx(id);
      ticketsArr.splice(ticketIdx, 1);
      updateLocalStorage();
    }
  });
}

function createTicket(ticketColor, ticketTask, ticketID) {
  // Create a new ticket container element
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  // Create the HTML content for the ticket container
  ticketCont.innerHTML = `
      <div class="ticket-color" style="background-color: ${ticketColor};"></div>
      <div class="ticket-id">${ticketID}</div>
      <div class="task-area">${ticketTask}</div>
      <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
      </div>
    `;
  // Append the ticket container to the main container
  mainCont.appendChild(ticketCont);
  handleRemoval(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
  // ticketsArr.push({ ticketID, ticketTask, ticketColor });
  // localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    // Remove 'active' class from all priority colors
    allPriorityColors.forEach(function (priorityColorElem) {
      priorityColorElem.classList.remove("active");
    });

    // Add 'active' class to the clicked colorElem
    colorElem.classList.add("active");

    modalPriorityColor = colorElem.classList[0];
  });
});

function handleLock(ticket) {
  const ticketLockElem = ticket.querySelector(".ticket-lock");
  const ticketLockIcon = ticketLockElem.children[0];
  const ticketTaskArea = ticket.querySelector(".task-area");
  const id = ticket.querySelector(".ticket-id").innerText;

  ticketLockIcon.addEventListener("click", function () {
    console.log("Lock Selected");
    const ticketIdx = getTicketIdx(id);
    if (ticketLockIcon.classList.contains(lockClose)) {
      ticketLockIcon.classList.remove(lockClose);
      ticketLockIcon.classList.add(lockOpen);
      ticketTaskArea.setAttribute("contenteditable", "true"); // Changed 'contenteditable', 'true'
    } else {
      ticketLockIcon.classList.remove(lockOpen);
      ticketLockIcon.classList.add(lockClose);
      ticketTaskArea.setAttribute("contenteditable", "false"); // Changed 'contenteditable', 'true'
    }
    ticketsArr[ticketIdx].taskContent = ticketTaskArea.innerText;
    updateLocalStorage();

  });
}

function handleColor(ticket) {
  const ticketColorBand = ticket.querySelector(".ticket-color");
  const id = ticket.querySelector(".ticket-id").innerText;
  ticketColorBand.addEventListener("click", function () {
    // let currentColor = ticketColorBand.classList[0];
    const ticketIdx = getTicketIdx(id);
    const currentColor = ticketColorBand.style.backgroundColor;

    let currentColorIdx = colors.findIndex(function (color) {
      return currentColor === color;
    });

    currentColorIdx++; // Increment the index

    const newTicketColorIdx = currentColorIdx % colors.length;
    const newTicketColor = colors[newTicketColorIdx];
    ticketColorBand.style.backgroundColor = newTicketColor;
    ticketsArr[ticketIdx].ticketColor = newTicketColor;
    updateLocalStorage();
  });
}

toolboxColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    const selectedColor = colorElem.classList[0];
    const allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach(function (ticket) {
      const ticketColorBand = ticket.querySelector(".ticket-color");
      if (ticketColorBand.style.backgroundColor === selectedColor) {
        ticket.style.display = "block";
      } else {
        ticket.style.display = "none";
      }
    });
  });
  colorElem.addEventListener("dblclick", function () {
    const allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach(function (ticket) {
      ticket.style.display = "block";
    });
  });
});

function updateLocalStorage() {
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

function getTicketIdx(id) {
  let ticketIdx = ticketsArr.findIndex(function(ticketObj) {
      return ticketObj.ticketID === id;
  });
  return ticketIdx;
}