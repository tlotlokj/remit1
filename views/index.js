fetch('http://localhost:3000/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    hidden: document.querySelector('#email').value,
    password: document.querySelector('#password').value,
  })
})
.then(response => response.json())
.then(data => {
  console.log(data);
});
