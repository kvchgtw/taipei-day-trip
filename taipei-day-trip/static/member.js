let signInButton = document.getElementById("sign-in-button")
let mask = document.getElementById("mask")
let signInDialog = document.getElementById("sign-in-dialog")
let signUpDialog = document.getElementById("sign-up-dialog")
let signInCloseButton = document.getElementById("sign-in-close-button")
let signUpCloseButton = document.getElementById("sign-up-close-button")

//切換登入與註冊
let switchToSignUp = document.getElementById("switch-to-sign-up")
let switchToSignIn = document.getElementById("switch-to-sign-in")

//CTA Button
let signInSubmitButton = document.getElementById("sign-in-submit-button")
let signUpSubmitButton = document.getElementById("sign-up-submit-button")

//用戶登入資料
let signInEmail = document.getElementById("sign-in-email-input")
let signInPassword = document.getElementById("sign-in-password-input")

//用戶註冊資料
let signUpName = document.getElementById("sign-up-name-input")
let signUpEmail = document.getElementById("sign-up-email-input")
let signUpPassword = document.getElementById("sign-up-password-input")

//error msg
let signInErrorMsg = document.getElementById("sign-in-error-msg")
let signUpErrorMsg = document.getElementById("sign-up-error-msg")


//fetch url
let signInAuthUrl = "/api/user/auth"
let signUpAuthUrl = "/api/user"


const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let localToken =""

let navBarItem = document.getElementById("nav-bar-item")

//取得用戶姓名
let username = ""


//點擊按鈕打開登入視窗
signInButton.addEventListener('click', function(){
    mask.classList.toggle("mask")
    signInEmail.value = ""
    signInPassword.value = ""
    signInDialog.style.display = "block"
    console.log("sign in event")

})

//點擊Close關閉視窗
signInCloseButton.addEventListener('click', function(){
        signInErrorMsg.innerHTML=""
        signInDialog.style.display = "none"
        mask.classList.toggle("mask")
})

signUpCloseButton.addEventListener('click', function(){
    signUpErrorMsg.innerHTML=""
    signUpDialog.style.display = "none"
    mask.classList.toggle("mask")
})

//切換至註冊頁面
switchToSignUp.addEventListener('click', function(){
    signUpErrorMsg.innerHTML=""
    signUpName.value = ""
    signUpEmail.value = ""
    signUpPassword.value = ""
    signUpErrorMsg.style.color = ""
    signInDialog.style.display = "none"
    signUpDialog.style.display = "block"
})

//切換至登入頁面
switchToSignIn.addEventListener('click', function(){
    signInErrorMsg.innerHTML=""
    signInEmail.value = ""
    signInPassword.value = ""
    signInDialog.style.display = "block"
    signUpDialog.style.display = "none"
})

//用戶點擊登入按鈕
signInSubmitButton.addEventListener('click', function(){
    signInErrorMsg.innerHTML=""
    email = signInEmail.value
    password = signInPassword.value

    if (email === "" || password === ""){
        signInErrorMsg.textContent="請輸入電子信箱與密碼"
    }else if(!emailPattern.test(email)){
        signInErrorMsg.textContent="請輸入有效的電子信箱"
    }
    else{

    let signIndata = {"email": email, "password": password}

    fetch(signInAuthUrl, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(signIndata)
        })
    .then(response => response.json())
    .then(data => {
        if (data.token){
            window.localStorage.setItem("token",data.token)
            signInDialog.style.display = "none"
            mask.classList.toggle("mask")
            if (bookingSignInEvent!==0){
                location.href = "/booking"
                bookingSignInEvent = 0
            }else{
                location.reload();
            }
            
        }else{
            signInErrorMsg.textContent="電子信箱或密碼輸入錯誤"
        }
    })


    }

})

//檢查登入狀態
window.onload = function(){
    checkSignIn()
    console.log("頁面載入時，檢查登入態")
}

function checkSignIn(){
    fetch(signInAuthUrl, {
        method: 'GET',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
        if (data!== null){       
            signOut()
            username = data.name
            console.log("memeber username:", username)
        }
    })
}

//登出功能
function signOut(){
    signInButton.style.display="none"
    let signout = document.createElement("div")
    signout.classList.add("nav-button")
    signout.textContent="登出系統"
    signout.setAttribute("id", "signout-button")
    navBarItem.appendChild(signout)

    signout.addEventListener('click', function(){
        signout.innerHTML=""
        localStorage.clear();
        signInButton.style.display="flex"
        let currentUrl = location.pathname
        console.log("currentUrl: ",currentUrl)
        let bookingUrl = "/booking"
        if (currentUrl == bookingUrl){
            location.href = "/"
        }else{
            location.reload();

        }
        


    })

    }



//用戶點擊註冊按鈕
signUpSubmitButton.addEventListener('click', function(){
    Name = signUpName.value
    email = signUpEmail.value
    password = signUpPassword.value

    if (Name === "" || email === "" || password === ""){
        signUpErrorMsg.textContent="請輸入姓名、電子信箱與密碼"
        
    }else if(!emailPattern.test(email)){
        signUpErrorMsg.textContent="請輸入有效的電子信箱"
    }
    else{

    let signUpdata = {"name": Name, "email": email, "password": password}

    fetch(signUpAuthUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(signUpdata)
        })
    .then(response => response.json())
    .then(data => {
        console.log("sign up fetch result:", data.error, data.ok)
        if (data.ok){
            console.log("註冊成功")
            signUpErrorMsg.style.color = "rgb(3, 166, 109)"
            signUpErrorMsg.textContent="註冊成功！"
        }else if(data.error === true){
            console.log("註冊失敗")
            signUpErrorMsg.textContent="此信箱已被註冊，請使用其他信箱註冊"
        }
        else{
            console.log("註冊失敗")
            signUpErrorMsg.textContent="系統錯誤，請稍後再試"
        }

        
    })


    }

})
    

