const unreadMessages = document.querySelectorAll(".unread");
const main = document.querySelector(".agashya");
const unread = document.getElementById("notifes");
const markAll = document.getElementById("mark_all");
unread.innerText = unreadMessages.length;

unreadMessages.forEach((message) => {
  message.addEventListener("click", () => {
    message.classList.toggle("unread");
    const newUnreadMessages = document.querySelectorAll(".unread");
    unread.innerText = newUnreadMessages.length;
  });
});
markAll.addEventListener("click", () => {
  unreadMessages.forEach((message) => message.classList.toggle("unread"));
  const newUnreadMessages = document.querySelectorAll(".unread");
  unread.innerText = newUnreadMessages.length;
});
const socket = io("http://localhost:3000", {
  auth: {
    token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU0MWM1YzMwLWY1N2YtNDZkMi05MjFlLWU4MDFhYTU5ZjFiZCIsImVtYWlsIjoiY29kZTExbGlmZUBnbWFpbC5jb20iLCJpYXQiOjE3MTQ4MTYxMTgsImV4cCI6MTcxNzQwODExOH0.EwJbdzQJuNbcc27D1mKc9n1NQ7uVxLaV5Cyua3JZDsE" // Send the authentication token with the connection request
  }
});
const userID = "a6eb0f51-c8a4-4d9a-9638-783ef7609fb6";
socket.on("connect", () => {
  socket.emit("joinRoom", userID);
  console.log("client connected successful");
});

const notification = [];
function calculateTimeDifference(eventTime) {
  const now = new Date();
  const eventTimestamp = new Date(eventTime);
  const difference = Math.floor((now - eventTimestamp) / (1000 * 60)); // Convert milliseconds to minutes
  return difference;
}
socket.on("productWished", (data) => {
  notification.push(data);
  main.innerHTML = "";
  notification.forEach((el) => {
    const template = `<div class="notif_card unread">
    <div class="description">
      <div class="user_activity">
        <strong>${el.subject}</strong>${el.messages}
      </div>
      <p class="time">${calculateTimeDifference(Date.now())} minutes ago</p>
    </div>
  </div>`;
    main.insertAdjacentHTML("afterbegin", template);
  });
  unread.innerText = notification.length;
});

socket.on("productUnavailable", (data) => {
  notification.push(data);
  main.innerHTML = "";
  notification.forEach((el) => {
    const template = `<div class="notif_card unread">
    <div class="description">
      <div class="user_activity">
        <strong>${el.subject}</strong>${el.messages}
      </div>
      <p class="time">${calculateTimeDifference(Date.now())} minutes ago</p>
    </div>
  </div>`;
    main.insertAdjacentHTML("afterbegin", template);
    console.log("Product wished:", data);
  });
  unread.innerText = notification.length;
});
