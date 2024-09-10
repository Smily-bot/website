const messageContainer = document.getElementById('message-container'); 
const messageInput = document.getElementById('message-input'); 
function sendMessage() 
{ 
  const message = messageInput.value; 
  if (message !== '') 
  { 
    const newMessageElement = document.createElement('div'); 
    const text2 = "you : ";
    text2.concat(message);
    newMessageElement.innerText = let result = text2
    messageContainer.appendChild(newMessageElement); 
    messageInput.value = ''; 
  } 
}
