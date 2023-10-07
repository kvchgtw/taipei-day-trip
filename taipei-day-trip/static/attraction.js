
//新增預定行程功能
let addBookingButton = document.getElementById("start-booking-button")

//圖片輪播
let imagesUrl = []
let currentIndex = 0

// radio button price
let price = document.getElementById("price")
let radioBtnMornig = document.getElementById("select-time-morning")

let selectTime = document.getElementById("select-time")
selectTime.addEventListener("click", function(event){
    if (radioBtnMornig.checked == true){
        price.innerHTML="2000"
    }else{
        price.innerHTML="2500"
    }

})




//fetch data
let id = window.location.pathname.split('/')[2];

let src = `/api/attraction/${(id)}`

fetch(src).then(function (response) {
    return response.json();
}).then(function (data) {
    // console.log(data.data)
    let desc = data.data.description
    let address = data.data.address
    let transport = data.data.transport
    let images = data.data.images
    let name = data.data.name
    let category = data.data.category
    let mrt = data.data.mrt


    let container = document.getElementById("desc-container")
    let descDiv = document.createElement("div")
    let addressDiv = document.createElement("div")
    let transportDiv =document.createElement("div")
    let addressTitle = document.createElement("div")
    let transportTitle = document.createElement("div")

    let spotNameContainer = document.getElementById("spotName")
    let categoryMrtContainer = document.getElementById("category-mrt")


    container.classList.add("desc-container")
    descDiv.classList.add("descDiv")
    addressDiv.classList.add("descDiv")
    transportDiv.classList.add("descDiv")
    addressTitle.classList.add("desc-title")
    transportTitle.classList.add("desc-title")

    
    descDiv.textContent = desc
    addressDiv.textContent = address
    transportDiv.textContent = transport
    addressTitle.textContent = "景點地址："
    transportTitle.textContent = "交通方式："
    spotNameContainer.textContent = name
    categoryMrtContainer.textContent = category+" at "+ mrt



    container.appendChild(descDiv)
    container.appendChild(addressTitle)
    container.appendChild(addressDiv)
    container.appendChild(transportTitle)
    container.appendChild(transportDiv)


    let photoDisplay = document.getElementById("photo-display")
    

    for (let i=0; i < images.length; i++){
        let imageData = images[i]
        
        imagesUrl.push(imageData)

    }
    showImages()
    

})


let photoDisplay = document.getElementById("photo-display")
const indicator = document.getElementById("indicator");
const prevButton = document.getElementById("arrow-btn-left");
const nextButton = document.getElementById("arrow-btn-right");



function showImages(){
    photoDisplay.innerHTML=""
    imagesUrl.forEach((imageUrl, index) => {
        const slide = document.createElement("div")
        slide.classList.add("slide-div")
        if (index === currentIndex){
            slide.classList.add("active");
        }
        const img  = document.createElement("img")
        img.classList.add("image")
        img.src = imageUrl
        slide.appendChild(img)
        photoDisplay.appendChild(slide)

    })
    updateIndicator()
}

function updateIndicator(){
    indicator.innerHTML=""
    imagesUrl.forEach((_, index) => {
        const dot = document.createElement("span")
        dot.classList.add("indicator-dot")
        if (index === currentIndex){
            dot.classList.add("active")
        }
        indicator.appendChild(dot)


    })
}

function prevSlide(){
    if (currentIndex > 0){
        currentIndex --;
    }else{
        currentIndex = imagesUrl.length -1
    }
    showImages()
}

function nextSlide(){
    if (currentIndex < imagesUrl.length-1){
        currentIndex ++;
    }else{
        currentIndex = 0;
    }

    showImages()
}





// 設定按鈕點擊事件
prevButton.onclick=function(){
    prevSlide()
};
nextButton.onclick=function(){
    nextSlide()

};

// 新增預定行程
addBookingButton.addEventListener('click', function(){
    let selectDate = document.getElementById("trip-date").value
    console.log(selectDate)
    if (selectDate == ""){
        alert("請選擇日期")
    }else{ 
        console.log(selectDate)

    let selectTime = document.querySelector('input[name="select-time"]:checked').value
    console.log(selectTime)
    let selectPrice = document.getElementById("price").textContent
    console.log(selectPrice)
    priceInt = parseInt(selectPrice)
    let attractionId = id

    let bookingData = {"attractionId": attractionId, "date": selectDate, "time": selectTime, "price": priceInt}

    fetch(apiBookingUrl, {
        method: 'POST',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token"), 'Content-Type': 'application/json'},
        body: JSON.stringify(bookingData)
        })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        location.href = "/booking"
    })
    }
})