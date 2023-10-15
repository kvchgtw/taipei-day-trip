

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

//全域宣告 for order data 
let bookingAttractionId = ''
let bookingimageUrl = ""
let bookingSpotName = ""
let bookingaddress = ""
let date = ""
let time = ""
let displayTime = ''
let price = ''

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
       welcomeTitleName.textContent = welcomeUsername
       userContactName.value = welcomeUsername

       let userEmail = data.email
       userContactEmail.value = userEmail


    })
    
    getBookingData_render()
    
    
}


deleteButton.addEventListener('click', function(){
        
    fetch(apiBookingUrl, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    .then(data => {
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
        
        bookingAttractionId = data.data.attraction.id
        bookingimageUrl = data.data.attraction.image
        bookingSpotName = data.data.attraction.name
        bookingaddress = data.data.attraction.address
        date = data.data.date
        time = data.data.time
        if (time=="morning"){
        displayTime = "上午 9 點至下午 4 點"
        }else if(time=="afternoon"){
        displayTime = "下午 3 點至晚上 9 點"
        }
        price = data.data.price

        let img = document.createElement("img")
        img.src = bookingimageUrl
        img.classList.add("booking-spot-img")
        bookingSpotImageContainer.appendChild(img)

        bookingSpotNameText.textContent=bookingSpotName
        bookingDate.textContent = date
        bookingTime.textContent = displayTime
        bookingPrice.textContent = price
        totalPrice.textContent = price
        bookingAddressText.textContent = bookingaddress

    }else if(data.data==null){
        fetch(apiBookingUrl, {
            method: 'DELETE',
            headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
            })
        .then(response => response.json())
        
        
        bookingInfoArea.innerHTML = ""
        bookingContactArea.innerHTML = ""
        bookingCreditCardArea.innerHTML = ""
        totalPriceDiv.innerHTML = ""
        ctaButton.innerHTML = ""
        firstSeparator.innerHTML= ""
        secondSeparator.innerHTML= ""
        lastSeparator.innerHTML= ""

        let nullDataText = document.createElement("div")
        nullDataText.classList.add("nullDataText")
        nullDataText.textContent = "目前沒有任何待預訂的行程"
        bookingInfoArea.appendChild(nullDataText)

        footerStyle.style.paddingBottom="100%"
        

    }
    
    })
}