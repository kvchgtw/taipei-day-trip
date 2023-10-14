let apiOrderUrl = "/api/orders"
// let orderData = {}

TPDirect.setupSDK(137381, 'app_lAEQcuIT7wCTBrUjoHveDTWj7vAfHETbaAYoKCzfTe5QyC75a9ingpkJ97JD', 'sandbox')

TPDirect.card.setup({
    fields: {
        number: {
            element: document.getElementById("card-number"),
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.getElementById("card-ccv"),
            placeholder: 'CVV'
        }
    },
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            // 'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})
const confirmOrderBtn = document.getElementById("confirm-order-button")
        // listen for TapPay Field
        TPDirect.card.onUpdate(function (update) {
            /* Disable / enable submit button depend on update.canGetPrime  */
            /* ============================================================ */
            // console.log(update.canGetPrime)
            // update.canGetPrime === true
            //     --> you can call TPDirect.card.getPrime()
            // const submitButton = document.querySelector('button[type="submit"]')
            if (update.canGetPrime) {
                // submitButton.removeAttribute('disabled')
                confirmOrderBtn.removeAttribute('disabled')
            } else {
                // submitButton.setAttribute('disabled', true)
                confirmOrderBtn.setAttribute('disabled', true)
            }


            
        })


const creditCardForm = document.getElementById("creditCard-form")
console.log(creditCardForm)

let prime = ''
let bookingContactName = document.getElementById("booking-contact-name")
let bookingContactEmail = document.getElementById("booking-contact-email")
let bookingContactPhone = document.getElementById("booking-contact-phone")


confirmOrderBtn.addEventListener("click", function(event){

    event.preventDefault()
    
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('伺服器內部錯誤，請再試一次。can not get prime')
        return
    }

    async function getPrimeAsync() {
        return new Promise((resolve, reject) => {
            TPDirect.card.getPrime(function (result) {
                if (result.status !== 0) {
                    reject('get prime error ' + result.msg);
                } else {
                    resolve(result.card.prime);
                }
            });
        });
    }
    
    async function sendPrimeData() {
        try {
            const prime = await getPrimeAsync();
    
            const orderData = {
                "prime": prime,
                "order": {
                    "price": price,
                    "trip": {
                        "attraction": {
                            "id": bookingAttractionId,
                            "name": bookingSpotName,
                            "address": bookingaddress,
                            "image": bookingimageUrl
                        },
                        "date": date,
                        "time": time
                    },
                    "contact": {
                        "name": bookingContactName.value,
                        "email": bookingContactEmail.value,
                        "phone": bookingContactPhone.value
                    }
                }
            };
    
            console.log("orderData", orderData);
    
            const response = await fetch(apiOrderUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ` + window.localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
    
            const paymentData = await response.json();
            console.log(paymentData.data.number);

            // let orderNumber = paymentData.data.number
            // console.log("order number:", orderNumber)
    
            // 在這裡可以處理伺服器的回應
            


            // location.href = "/thankyou";
            deleteBooking();
        } catch (error) {
            console.error(error);
        }
    }
    
    // 呼叫主函數
    sendPrimeData();
    

    
})
        
function deleteBooking(){
    fetch(apiBookingUrl, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer `+ window.localStorage.getItem("token")},
        })
    .then(response => response.json())
    
}

