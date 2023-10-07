let bookingEntry = document.getElementById("booking-entry-button")

//booking 登入計數器，若用戶點擊預定行程而啟動登入彈窗，由此判斷是否重定向至booking 
let bookingSignInEvent = 0

//取資料
let welcomeTitleName = document.getElementById("welcome-title-name")
let apiBookingUrl = "/api/booking"

let bookingSpotNameText = document.getElementById("booking-spot-name-title")
let bookingDate = document.getElementById("booking-spot-date")
let bookingTime = document.getElementById("booking-spot-time")
let bookingPrice = document.getElementById("booking-spot-price")
let bookingAddressText = document.getElementById("booking-spot-address")
let bookingSpotImageContainer = document.getElementById("booking-spot-image")
let totalPrice = document.getElementById("total-price")

//自動帶入用戶姓名與email

let welcomeUsername = "" 
let userContactName = document.getElementById("booking-contact-name")
let userContactEmail = document.getElementById("booking-contact-email")


//若用戶沒有任何預定行程，需操作booking page物件為空狀態

let bookingInfoArea = document.getElementById("booking-info-area")
let bookingContactArea = document.getElementById("booking-contact-area-flex")
let bookingCreditCardArea = document.getElementById("booking-creditcard-area-flex")
let firstSeparator = document.getElementById("first-separator")
let secondSeparator = document.getElementById("second-separator")
let lastSeparator = document.getElementById("last-separator")

let totalPriceDiv = document.querySelector(".total-price")
let ctaButton = document.querySelector(".cta-button")

//footer css 操作
let footerStyle = document.getElementById("bottom-element")

//delete 功能
let deleteButton = document.querySelector(".delete-button")


bookingEntry.addEventListener('click', function(){
    console.log("點擊預定行程")
    bookingCheckSignIn()
    if (bookingSignInEvent == 0){
        bookingSignInEvent = bookingSignInEvent+1
    }
})


function bookingCheckSignIn(){
    fetch(signInAuthUrl, {
        method: 'GET',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
        if (data!== null){       
            location.href = "/booking"
        }else{
            mask.classList.toggle("mask")
            signInEmail.value = ""
            signInPassword.value = ""
            signInDialog.style.display = "block"
            console.log("booking init sign in event")
        }
    })
}

getOrderData()

function getOrderData(){
    // 拿到用戶的姓名
    fetch(signInAuthUrl, {
        method: 'GET',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
       welcomeUsername = data.name
       console.log("booking username:", welcomeUsername)
       welcomeTitleName.textContent = welcomeUsername
       userContactName.value = welcomeUsername

       let userEmail = data.email
       userContactEmail.value = userEmail


    })
    
    getBookingData_render()
    
    
}


deleteButton.addEventListener('click', function(){
        console.log("clicked delete2")
    
    
    fetch(apiBookingUrl, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
        console.log("Delete API:", data)
        getBookingData_render()

    })
})


function getBookingData_render(){
    fetch(apiBookingUrl, {
        method: 'GET',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
       
        if (data.data !== null){
        console.log("data 不是 null: ", data.data)

        let bookingimageUrl = data.data.attraction.image
        let bookingSpotName = data.data.attraction.name
        let bookingaddress = data.data.attraction.address
        // console.log("booking address", bookingaddress)
        let date = data.data.date
        let time = data.data.time
        if (time=="morning"){
        time = "上午 9 點至下午 4 點"
        }else if(time=="afternoon"){
        time = "下午 3 點至晚上 9 點"
        }
        let price = data.data.price

        let img = document.createElement("img")
        img.src = bookingimageUrl
        img.classList.add("booking-spot-img")
        bookingSpotImageContainer.appendChild(img)

        bookingSpotNameText.textContent=bookingSpotName
        bookingDate.textContent = date
        bookingTime.textContent = time
        bookingPrice.textContent = price
        totalPrice.textContent = price
        bookingAddressText.textContent = bookingaddress

    }else if(data.data==null){
        console.log("data is null:", data.data)
        bookingInfoArea.innerHTML = ""
        bookingContactArea.innerHTML = ""
        bookingCreditCardArea.innerHTML = ""
        totalPriceDiv.innerHTML = ""
        ctaButton.innerHTML = ""
        firstSeparator.innerHTML= ""
        secondSeparator.innerHTML= ""
        lastSeparator.innerHTML= ""

        let nullDataWelcomeTitle = document.createElement("div")
        nullDataWelcomeTitle.classList.add("welcome-title")
        nullDataWelcomeTitle.innerHTML = "您好，" + welcomeUsername +"，待預定的行程如下："
        console.log ("null data case username: ", welcomeUsername)
        bookingInfoArea.appendChild(nullDataWelcomeTitle)

        let nullDataText = document.createElement("div")
        nullDataText.classList.add("nullDataText")
        nullDataText.textContent = "目前沒有任何待預訂的行程"
        bookingInfoArea.appendChild(nullDataText)

        footerStyle.style.paddingBottom="100%"
        

    }
    
    })
}