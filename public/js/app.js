const loginForm = document.querySelector('form')
const username = document.querySelector('#username')
const password = document.querySelector('#password')
const messageOne = document.querySelector('#message-1')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = username.value
    const pass = password.value
    const ldata = {
        name: name,
        password: pass
    }

    messageOne.textContent = 'Loading...'

    fetch('/users/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ldata)
    }).then((response) => {
        response.json().then((req,res) => {
            if (req.error) {
                messageOne.textContent = req.error
            } else {
                messageOne.textContent = 'Welcome '+ name
                localStorage.setItem("userToken",req.token)
                localStorage.setItem("userName",req.name)
                // window.setTimeout(function() {
                //     window.location = 'myTasks'
                // },500)
                                
            }
        })
    })
})