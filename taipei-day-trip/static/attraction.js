//圖片輪播
let imagesUrl = []
let currentIndex = 0

// radio button price
let price = document.getElementById("price")
let radioBtnMornig = document.getElementById("select-time-morning")

let selectTime = document.getElementById("select-time")
selectTime.addEventListener("click", function(event){
    if (radioBtnMornig.checked == true){
        price.innerHTML="新台幣 2000 元"
    }else{
        price.innerHTML="新台幣 2500 元"
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
    console.log(name)


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
    // spotNameContainer.classList.add("spotName")
    // categoryMrtContainer.classList.add("category-mrt")
    
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
    // let photoFrameDiv = document.createElement("div")
    

    for (let i=0; i < images.length; i++){
        let imageData = images[i]
        // let imageImg = document.createElement("img")
        // imageImg.classList.add("image")
        // imageImg.src = imageData
        
        // // photoFrameDiv.appendChild(imageImg)
        // photoDisplay.appendChild(imageImg)
        imagesUrl.push(imageData)

    }
    // console.log(imagesUrl)//得到景點的圖片連結陣列
    showImages()

    
    // let image = document.createElement("img");
    // image.src = spotData["images"][0];

    // image.classList.add("content-image");


    // image.src = spotData["images"][0];
    // imageDiv.appendChild(image);

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


// prevButton.addEventListener("click", prevSlide());
// nextButton.addEventListener("click", nextSlide());
// 圖片輪播



// 設定按鈕點擊事件
prevButton.onclick=function(){
    prevSlide()
    console.log("pressed prev")
};
nextButton.onclick=function(){
    nextSlide()
    console.log("pressed next")

};
// 從1開始，max = image.length
// prev/next 就是-1 or +1
// if index <= 1, 不能再減1; if index >= max, 無法再加1
// 圓點
// 圓點數量 = image.length
// 當前展示的圖片的圓點, slideIndex 是1，那就是第一個圓點為當前圖片圓點，slideIndex = pointIndex
// 