let fetching = false
let nextPage = 0
let keyword = ""
let src = `http://13.112.47.131:3000/api/attractions?keyword=${(keyword)}&page=`+nextPage


function loadMoreData(observer, keyword, nextPage) {

        console.log("loadMoreData fetch:", src)
        fetch(src).then(function (response) {
            return response.json();
        }).then(function (data) {
            
            spotDivGenerator(data, { clearOldData: false });
            
            if (data["nextPage"] !== null) {
                nextPage = data["nextPage"]
                src =  `http://13.112.47.131:3000/api/attractions?keyword=${(keyword)}&page=`+nextPage
                console.log("src:",src)
            } else {
                console.log('No more pages to load.');
                return
            };

            fetching = false;
        });
    }


window.onload = function getData(){
    //用fetch連線並取得資料
    fetch("http://13.112.47.131:3000/api/mrts").then(function(response){
        return response.json();
    }).then(function(data){
        
        
        let mrt = data["data"] // 從 mrt API 中，取出 "data" 裡面的值
        
        // 獲取包含生成的<div>的容器元素
        const container = document.getElementById("mrt-list-item");

        // 遍歷捷運站數據，為每個捷運站創建一個<div>元素
        mrt.forEach(function(mrtName) {
            const mrtDiv = document.createElement("div");
            mrtDiv.textContent = mrtName;
            
            // 可以為每個<div>元素添加額外的類名或樣式
            mrtDiv.classList.add("mrt-list-item-name");
            mrtDiv.setAttribute("id", "mrt-list-item-name")

            // 將生成的<div>元素添加到容器中
            container.appendChild(mrtDiv);
        });
           
        const scrollLeft = document.getElementById("arrow-btn-left");
        const scrollRight = document.getElementById("arrow-btn-right");


        // 設定按鈕點擊事件
        scrollLeft.onclick=function(){
            document.getElementById('mrt-list-item').scrollLeft -= document.getElementById('mrt-list-item').clientWidth;
        };
        scrollRight.onclick=function(){
            document.getElementById('mrt-list-item').scrollLeft += document.getElementById('mrt-list-item').clientWidth;
        };

    });
   

  };



  document.addEventListener("DOMContentLoaded", function() {
    
   


// 觀察器
    let options = {
        rootMargin:'0px',
        threshold:0.5   // 看到一半的target，就執行callback
         }
    
    let callback=(e)=>{ // 觸發條件後要處理的回呼函式
    if(e[0].isIntersecting){  
        if(fetching===false){  
            fetching = true;
            console.log("footer fetching: ", fetching)
            loadMoreData(observer, keyword, nextPage);

            }else{
            observer.unobserve(bottomElement);  // 取消觀察目標
                }
        }
    }; 


    
    let observer = new IntersectionObserver(callback, options)

    // // 宣告頁面底部元件
    const bottomElement = document.getElementById('footer-text');

    // 將頁面底部元件加入 IntersectionObserver
    observer.observe(bottomElement);

    //Search Function

    //關鍵字搜尋功能
    let searchForm = document.getElementById("search-form")
    let searchInput = document.getElementById("search-input")

    //用戶點擊捷運站列表

    searchForm.addEventListener("submit", function (event) {
        
        event.preventDefault(); // 防止表單提交的默認行為

        // 獲取用戶輸入的搜尋關鍵字
        keyword = searchInput.value.trim();
        console.log(keyword)

        // 在這裡可以執行搜尋操作，例如發送 AJAX 請求到後端 API
        // 並處理後端返回的搜尋結果
        // 組合 API URL，將關鍵字添加到 URL 中
        src = `http://13.112.47.131:3000/api/attractions?keyword=${(keyword)}&page=`+nextPage;
        console.log("search: ",src)

        const spotContainer = document.getElementById("content-grid-frame");
        spotContainer.innerHTML = "";
        loadMoreData(observer, keyword, nextPage);
        
       
       
    });

    //點擊捷運站，並以捷運站名作為關鍵字去搜尋
    let mrtClickContainer = document.getElementById("mrt-list-item")
    mrtClickContainer.addEventListener("click", function (event){
      if (event.target.classList.contains("mrt-list-item-name")){
          let mrtName = event.target.textContent;//把用戶點擊的捷運站名稱存在 mrtName 中
             // 更新搜尋框的內容為被點擊的捷運站名稱
            searchInput.value = mrtName;

            let apiUrl = `http://13.112.47.131:3000/api/attractions?keyword=${(mrtName)}`;
            fetch(apiUrl).then(function(response){
            return response.json();
            }).then(function(data){
            
            spotDivGenerator(data, { clearOldData: true });

        });

        };
    });
    

}); //這是domcontentload

//生成div函式

function spotDivGenerator(data, config={}){
        
    if (config.clearOldData) {
        const spotContainer = document.getElementById("content-grid-frame");
        spotContainer.innerHTML = "";
        };

        let spot = data["data"] // 從 attractions API 中，取出 "data" 裡面的值
        // console.log(spot[0]["name"],spot[0]["mrt"]) // 這才能取到 "新北投"
       
        const spotContainer = document.getElementById("content-grid-frame");

        for (let i=0; i < spot.length; i++) {
            
            let spotData = spot[i];
            const spotDiv = document.createElement("div"); //每一格展示景點訊息的容器
            spotDiv.classList.add("content-grid"); // 添加額外的類名或樣式，以便設計

            const mrtCategoryDiv = document.createElement("div"); //每一格展示景點訊息的容器
            mrtCategoryDiv.classList.add("content-grid-mrt-category"); // 添加額外的類名或樣式，以便設計

            const imageDiv = document.createElement("div");
            imageDiv.classList.add("content-grid-image"); // 添加額外的類名或樣式
            const image = document.createElement("img");
            image.classList.add("content-image");

            image.src = spotData["images"][0];
            imageDiv.appendChild(image);

            const spotNameDiv = document.createElement("div");
            spotNameDiv.textContent = `${spotData.name}`;
            spotNameDiv.classList.add("content-grid-text");
            
            const mrtDiv = document.createElement("div");
            mrtDiv.classList.add("content-grid-mrt-and-category"); // 添加額外的類名或樣式，以便設計

            mrtDiv.textContent = `${spotData.mrt}`;

            const categoryDiv = document.createElement("div");
            categoryDiv.textContent = `${spotData.category}`;
            categoryDiv.classList.add("content-grid-mrt-and-category"); // 添加額外的類名或樣式，以便設計

            spotDiv.appendChild(imageDiv);
            spotDiv.appendChild(spotNameDiv);
            mrtCategoryDiv.appendChild(mrtDiv);
            mrtCategoryDiv.appendChild(categoryDiv);
            spotDiv.appendChild(mrtCategoryDiv);

            spotContainer.appendChild(spotDiv);
        }

};
