const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = document.querySelector(".textArea-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const allTickets = document.querySelectorAll(".ticket-cont");


let addTaskFlag = false;
let modalPriorityColor = "black";
let removeTaskFlag = false;

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

function handleRemoval(ticket) {
  ticket.addEventListener("click", function () {
    if (!removeTaskFlag) return;
    else {
      ticket.remove();
    }
  });
}


function createTicket(ticketColor, ticketTask, ticketID) {
  // Create a new ticket container element
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont"); //
  ticketCont.innerHTML = `
  <div class="ticket-color" style="background-color: ${ticketColor}"></div>
  <div class="ticket-id">${ticketID}</div>
  <div class="task-area">${ticketTask}</div>
  <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
</div>
  `;
  mainCont.appendChild(ticketCont);
  handleRemoval(ticket);
}

modalCont.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key === "Shift") {
    // const ticketID = Math.random().toString(36).substring(2, 8);
    let ticketID = shortid();
    const taskContent = textArea.value; // Get the content from the textarea
    createTicket(modalPriorityColor, taskContent, ticketID); // Call the createTicket function to create a new ticket
    modalCont.style.display = "none"; // Hide the modal
    textArea.value = ""; // Clear the textarea's content
    addTaskFlag = false;
  }
});

allPriorityColors.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    // Remove 'active' class from all priority colors
    allPriorityColors.forEach(function (priorityColorElem) {
      priorityColorElem.classList.remove("active");
    });

    // Add 'active' class to the clicked colorElem
    colorElem.classList.add("active");

    // Implement additional logic to assign the selected color to a task
    // For example, you can use this space to perform your task color assignment
    modalPriorityColor = colorElem.classList[0];
  });
});
