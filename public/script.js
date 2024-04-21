/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */

const initChat = () => {
  const token = localStorage.getItem("token");
  const socket = io("http://localhost:3001", { auth: { token } });
  const chatMessagesContainer = document.querySelector(".chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  function tokenDecode(token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  function createMessageElement(message, isSentByCurrentUser) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Create sender name element
    const senderNameElement = document.createElement("div");
    senderNameElement.classList.add("sender-name");
    senderNameElement.textContent = isSentByCurrentUser
      ? "You"
      : message.sender.firstName;
    senderNameElement.style.color = "orange"; // Set the color to orange

    // Append sender name to message element
    messageElement.appendChild(senderNameElement);

    // Create text element for the message content
    const textElement = document.createElement("div");
    textElement.textContent = message.message;

    // Append text element to message element
    messageElement.appendChild(textElement);

    if (isSentByCurrentUser) {
      messageElement.classList.add("sent");
    } else {
      messageElement.classList.add("received");
    }

    return messageElement;
  }

  // Listen for "all messages" event and update the chat history
  socket.on("all messages", (messages) => {
    messages.forEach((msg) => {
      const messageElement = createMessageElement(
        msg,
        msg.sender.id === tokenDecode(token).id
      );
      chatMessagesContainer.appendChild(messageElement);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  });

  // Listen for "chat message" event and append the new message
  socket.on("chat message", (newMessage) => {
    const isSentByCurrentUser = newMessage.sender.id === tokenDecode(token).id;
    if (!isSentByCurrentUser) {
      const messageElement = createMessageElement(newMessage, false);
      chatMessagesContainer.appendChild(messageElement);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  });

  sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
      const decoded = tokenDecode(token);
      const userId = decoded.id;
      socket.emit("chat message", { senderId: userId, message }, (response) => {
        if (response.status === "ok") {
          console.log("Message sent successfully");
          // Append the new message to the UI for the sender
          const newMessage = response.newMessage;
          const messageElement = createMessageElement(newMessage, true);
          chatMessagesContainer.appendChild(messageElement);
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        } else {
          console.error("Error sending message:", response.error);
        }
      });
      chatInput.value = "";
    }
  });

  // Listen for "typing" event and display typing indicator
  socket.on("typing", (data) => {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.textContent = `${data.sender.firstName} is typing...`;
    chatMessagesContainer.appendChild(typingIndicator);
  });

  // Listen for "stop typing" event and remove typing indicator
  socket.on("stop typing", () => {
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) {
      chatMessagesContainer.removeChild(typingIndicator);
    }
  });

  // Typing indicator logic
  let typingTimeout;
  chatInput.addEventListener("input", () => {
    clearTimeout(typingTimeout);
    socket.emit("typing", {
      sender: {
        id: tokenDecode(token).id,
        firstName: tokenDecode(token).firstName
      }
    });
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing");
    }, 500);
  });
};

window.addEventListener("load", initChat);
