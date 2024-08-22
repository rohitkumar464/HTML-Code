let checkRequest;
var x;
let checkLoader;
var wixStudioButtonText = new Array("新增到購物車中", "Buy Now", "Purchase Selected", "Realizar compra");
var pageViewData = null;
var wixAuctionEvent = {
    "appId" : "32a9261e-6771-4ab9-bbc8-300512db4d30",
    'dataHook': '[data-hook="CartItemsDataHook.root"]',      
    'current_user' : null,

    init : function() {
        var self = this;
        if (typeof window.wixDevelopersAnalytics !== "undefined") {
            self.registerWixEvents();
        } else {
            window.addEventListener("wixDevelopersAnalyticsReady", self.registerWixEvents);
        }
    },

    registerWixEvents: function() {
        window.wixDevelopersAnalytics.register(wixAuctionEvent.appId, function report(eventName, data) {
            console.log(eventName,data);
            switch(eventName) { 
                case 'PageView':
                    pageViewData = data;
                    if (data.pageTypeIdentifier == "shopping_cart") {
                        wixAuctionEvent.addDatePicker();
                    }
                    break;
            }
        });
    },
    addDatePicker : function() {
        console.log("endpoint");
        var endpointData = this.getEndpointUrl();
        console.log(endpointData);
        const url = `${endpointData.url}/${endpointData.langCode}/wix/app/wixeds/${endpointData.storeHash}/endpoint/order`;
        console.log(url);
        fetch(url, {
        })
        .then((res) => {
            return res.text();
        }).then((resp) => {
            if(!this.isJSON(resp)){
                resp = "{}";
            }
            let data = JSON.parse(resp);
            
            if (data.status === 'updated') {
                location.reload();
            }
            console.log("html code");
            let html = data.html ? data.html : null;
            var node  = document.querySelector(wixAuctionEvent.dataHook);
            var div = document.createElement("div");
            node.appendChild(div);
            if (html) {
                if (typeof(div)) {
                    div ? div.innerHTML = html : "";

                    var script = document.createElement('script');
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js';
                    document.head.appendChild(script);
                    // script.onload = () => {
                    //     setTimeout(() => {
                            var script = document.createElement('script');
                            script.src = `${endpointData.url}/js/Wix/EstimatedDeliverySlot/script.js`;
                            console.log(script);
                            document.head.appendChild(script);
                        // }, 4000);
                    // }
                    // console.log(script);
                    // document.head.appendChild(script);


                    

                    pageLoader.hideLoader();
                    checkRequest = 0;
                    return html;
        }

            }
        }).catch(error => {
            pageLoader.hideLoader();
            console.log("error");
            console.error('Fetch error:', error);
        });
    },
    getEndpointUrl : function() {
        if (typeof document.getElementById("wk-wix-eds-script") !== undefined && document.getElementById("wk-wix-eds-script") != null){
            
            let src = document.getElementById("wk-wix-eds-script").src;
            let queryParams = src.split("?");
            queryParams = (typeof queryParams[1] !== undefined) ? queryParams[1].split("=") : "";
            let endpointData = {};
    
            if (typeof queryParams[1] !== undefined) {
                let dynParam = queryParams[1].split("|");
                endpointData.storeHash = (typeof dynParam[0] !== undefined) ?this.converHexEscape(dynParam[0]) : "";
                endpointData.langCode = (typeof dynParam[1] !== undefined) ? dynParam[1] : "";
                endpointData.url = (typeof dynParam[2] !== undefined) ? dynParam[2] : "";
            }

            return endpointData;
        }
    },

    converHexEscape : function (hexEscape) {
    return hexEscape.replace(/\\x([A-Fa-f0-9]{2})/g,function(match,grp) {
        return "%"+grp;
    });
    },
    isJSON : function(resp) {
        try {
            JSON.parse(resp);
        } catch (e) {
            return false;
        }
        return true;
    }
    
    
};

const pageLoader = {
    __loader: null,
    showLoader : () => {
        var divContainer = document.createElement('div');
            divContainer.style.position = 'fixed';
            divContainer.style.left = '0';
            divContainer.style.top = '0';
            divContainer.style.display = 'flex';
            divContainer.style.justifyContent = 'center'
            divContainer.style.alignItems = 'center'
            divContainer.style.width = '100%';
            divContainer.style.height = '100%';
            divContainer.style.zIndex = '9998';
            divContainer.style.background = "white";
            divContainer.style.opacity = "0.98";
        
        var div  = document.createElement('div'); 
                div.style.zIndex = '9999';
                div.style.height = '30px';
                div.style.width = '30px';
                div.style.border = '5px solid #e1e1e1';
                div.style.borderRadius = '50%';
                div.style.borderTop = '5px solid #2196f3';    
                
            div.animate([
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ], {
                duration: 2000,
                iterations: Infinity
            });
            if (!checkLoader) {
            divContainer.appendChild(div);
            this.__loader = divContainer
            document.body.appendChild(this.__loader);
        }
        checkLoader = true;
    },
    hideLoader : ()=>{
        if (this.__loader!=null) {
            this.__loader.style.display="none";
            checkLoader = false;
        }
    }
}



wixAuctionEvent.init();

class WixEstimatedDeliverySlotEvent {

    constructor() {
        this.appId = "32a9261e-6771-4ab9-bbc8-300512db4d30";
        this.dataHook = '[data-hook="CartItemDataHook.root"]';
        this.current_user = null;
        this.endpointData = this.getEndpointUrl();
        this.loader = new SlotPageLoader();
    }

    init() {
        this.loader.loadLoader();
        if (typeof window.wixDevelopersAnalytics !== "undefined") {
            this.registerWixEvents();
        } else {
            window.addEventListener("wixDevelopersAnalyticsReady", this.registerWixEvents.bind(this));
        }
    }

    registerWixEvents() {
        window.wixDevelopersAnalytics.register(this.appId, (eventName, data) => {
            console.log(eventName, data);
            switch (eventName) {
                case 'AddProductImpression':
                    break;
                case 'PageView':
                    // pageViewData = data;
                    if (data.pageTypeIdentifier == "shopping_cart") {
                        // wixAuctionEvent.autionsProduct();
                        this.addDatePicker();
                        
                    }
                break;
            }           
        });
    }

    fetchData(url, callback) {
        fetch(url, {})
        .then(res => res.text())
        .then(callback)
        .catch(error => {
            console.error('Fetch error:', error);
            this.loader.hideLoader();
        });
    }

    getEndpointUrl() {
        if (typeof document.getElementById("wk-wix-gift-script") !== "undefined" && document.getElementById("wk-wix-gift-script") != null) {
            let src = document.getElementById("wk-wix-gift-script").src;
            let queryParams = src.split("?");
            queryParams = (typeof queryParams[1] !== "undefined") ? queryParams[1].split("=") : "";
            let endpointData = {};

            if (typeof queryParams[1] !== "undefined") {
                let dynParam = queryParams[1].split("|");
                endpointData.storeHash = (typeof dynParam[0] !== "undefined") ? this.converHexEscape(dynParam[0]) : "";
                endpointData.langCode = (typeof dynParam[1] !== "undefined") ? dynParam[1] : "";
                endpointData.url = (typeof dynParam[2] !== "undefined") ? dynParam[2] : "";
            }

            return endpointData;
        }
    }

    converHexEscape(hexEscape) {
        return hexEscape.replace(/\\x([A-Fa-f0-9]{2})/g, function (match, grp) {
            return "%" + grp;
        });
    }
    addDatePicker() {
        // Find the cart container or a suitable insertion point
        var self = this;
    
        var div  = document.querySelector('[data-hook="CartItemDataHook.root"]');
      
        if (div != null) {
            var devEle = document.createElement("div");
            devEle.id = "wk-wix-eds";
            devEle.appendChild(self.createStyle());
            devEle.appendChild(self.createInputContainer());
            devEle.appendChild(self.createCheckboxContainer());
            devEle.appendChild(self.createErrorContainer());
            devEle.appendChild(self.createBtnContainer());  
         
        }
    }
    createLabel(data) {
        const elm = document.createElement(data.control);
        elm.id = data.id;
        elm.for = data.for;
        elm.innerHTML = data.text;
      
        return elm;
    }
  
    createSubscriber(data) {
        
        const elm = document.createElement(data.control);
        elm.type = data.type;
        elm.id = data.id;
        elm.name = data.name;
        if(data.placeholder !== undefined) {
          elm.placeholder = data.placeholder;
        }
      
        if(data.value) {
          elm.value = data.value;
        }
      
        return elm;
    }
    createInputContainer() {
        var self = this;
        const inputContainer = document.createElement('div');
        inputContainer.id = 'element-control';
        inputContainer.appendChild(self.createLabel({'control':'label', 'id': 'label-userEmail', 'for': 'userEmail', 'text':'Email For Price Drop Alert'}));
        inputContainer.appendChild(self.createSubscriber({'control':'input', 'type':'text', 'id':'userEmail', 'name' : 'userEmail', 'placeholder': 'Please Enter Your Email'}));
        
        return inputContainer;
    }
  
    createTextContainer() {
        var self = this;
        const textContainer = document.createElement('span');
        textContainer.id = 'tcContainer';
      
        let anch = '<span class="span-text" onclick="openForm()">Read More...</span>';
        textContainer.innerHTML = `*Terms & Conditions. ${anch}`;
        
        return textContainer;
    }
  
    createCheckboxContainer() {
        var self = this;
        const checkboxContainer = document.createElement('div');
        checkboxContainer.id = 'checkbox-control';
        checkboxContainer.appendChild(self.createSubscriber({'control':'input', 'type':'checkbox', 'id':'tcCheck', 'name' : 'tcCheck'}));
        checkboxContainer.appendChild(self.createTextContainer());
        
        return checkboxContainer;
    }
  
    createErrorContainer() {
        const errorController = document.createElement('div');
        errorController.id = 'error-control';
    
        return errorController;
    }
  
    createBtnContainer() {
        var self = this;
        const btnController = document.createElement('div');
        btnController.id = 'element-button';
        btnController.appendChild(self.createSubscriber({'control':'input', 'type':'button', 'id':'sendSubscriber', 'name' : 'sendSubscriber', 'value': 'Subscribe'}));
      
        return btnController;
    }
  
    createStyle() {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            #element-control {
              margin-bottom: 1rem;
            }
            #element-control label {
              font: normal normal normal 13px/1.4em futura-lt-w01-light,futura-lt-w05-light,sans-serif;
              color: #554B29;
            }
            #userEmail{
              display: block;
              width: 30em;
              height: 2.9em;
              padding: 0.375rem 0.75rem;
              font-size: 1rem;
              font-weight: 400;
              line-height: 1.5;
              color: #495057;
              background-color: #fff;
              background-clip: padding-box;
              border: 1px solid #ced4da;
            }
            #checkbox-control{
              margin-bottom: 1rem;
            }
            #tcCheck {
                -webkit-appearance: checkbox;
              }
            #tcContainer{
              font: normal normal normal 13px/1.4em futura-lt-w01-light,futura-lt-w05-light,sans-serif;
              color: #554B29;
            }
            #sendSubscriber {
              width: 20.6em;
              font: normal normal normal 16px/1.4em futura-lt-w01-light,futura-lt-w05-light,sans-serif;
              color: #FFFFFF;
              background-color: rgb(127, 112, 61);
              border-width: 0;
              min-width: 100px;
              border-style: solid;
              box-sizing: content-box;
              transition: background-color .2s ease-in-out,border-color .2s ease-in-out,color .2s ease-in-out;
              position: relative;
              cursor: pointer;
              display: block;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding: 8px 16px;
            }
            #error-control{
              display: none;
              margin-bottom: 1rem;
              color: red;
              font: normal normal normal 12px/1.4em futura-lt-w01-light,futura-lt-w05-light,sans-serif;
            }
            * {
            box-sizing: border-box;
          }
          .openBtn {
            display: flex;
            justify-content: left;
          }
          .openButton {
            border: none;
            border-radius: 5px;
            background-color: #1c87c9;
            color: white;
            padding: 14px 20px;
            cursor: pointer;
            position: fixed;
          }
          .loginPopup {
            position: relative;
            width: 100%;
          }
          .formPopup {
            position: fixed;
            left: 45%;
            top: 15%;
            transform: translate(-50%, 5%);
            border: 1px solid #999999;
            z-index: 50;
            border-radius: 2px;
          }
          .formContainer {
            max-width: 500px;
            max-height: 500px;
            background-color: #fff;
          }    
          .span-text{
            cursor:pointer;
          }
          .modal-header{
            border-bottom: 1px solid #e9ecef;
            padding: 20px;
          }
          .modal-header h5{
            float:left;
          }
          .modal-header .close {
            padding: 1rem;
            margin: -2.5rem -1rem -1rem auto;
          }
          .modal-body{
            padding: 20px;
            overflow-y: auto;
            max-height: 400px;
            border-bottom: 1px solid #e9ecef;
          }
          .close{
            cursor: pointer;
            float: right;
            font-size: 1.3125rem;
            font-weight: 700;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #FFF;
            opacity: .5;
          }
          .modal-body{
            font-family: auto;
            font-size: 13px;
          }
          .modal-footer{
            padding: 10px;
          }
          .modal-container{
            position: fixed;
            display: none;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 50;
          }
      
          .hidden{
            display:none;
          }
          
          input[type=checkbox] + label {
            position:fixed;
          } 
          
          input[type=checkbox]:checked + label {
            animation: closing 0.3s forwards ease-in-out,
                       moving 0.3s forwards ease-in-out;
          } 
          
          .close{
          
              float:right;
              color: #b94b45;
              cursor: pointer; cursor: hand;
          }
          
          .alert-message{
            border: 1px solid rgba(#34495e, 0.25);
            color: #b94b45;
            border-radius: 3px;
            line-height:25px;
            position: absolute;
            top: 135px;
            display:block;
            width:30%;
            padding: 12px;
            box-sizing: border-box;
            color: rgba(255, 255, 255, .9);
            box-shadow: 0px 10px 50px rgba(0,0,0,.6);
            right:0;
          }
          
          @keyframes closing {
            from {
              opacity: 1; 
            }
            to {
              opacity: 0;
            }
          }
          
          @keyframes moving {
            0%, 90% { top: 0; left: 0; }
            100%  { top: -100px; left: 0; }
          }
          .flashContainer{
            display:relative;
          }
          .success {
            background-color: #d4edda;  
            color: #155724;
          }
          .danger {
            background: #ea8b8b;
            color: #a00202;
          }
      
          @media only screen and (max-width: 400px) {
            #element-control, #checkbox-control, #error-control, #element-button{
              padding: 0 25px 0 25px;
            }
          }
          `;
        return styleElement;
    }
  
    // addDatePickerFunctionality() {
    //     const datePicker = document.getElementById('delivery-date');
    //     if (datePicker) {
    //         datePicker.addEventListener('change', (event) => {
    //             this.handleDateSelection(event.target.value);
    //         });
    //     }
    // }
    // handleDateSelection(date) {
    //     console.log('Selected Delivery Date:', date);
    //     // Implement any additional logic needed to process the selected date
    // }
}

class SlotPageLoader {
    constructor() {
        this.__loader = null;
    }

    loadLoader() {
        var divContainer = document.createElement('div');
        divContainer.style.position = 'fixed';
        divContainer.style.left = '0';
        divContainer.style.top = '0';
        divContainer.style.width = '100%';
        divContainer.style.height = '100%';
        divContainer.style.zIndex = '9998';
        divContainer.style.background = "white";
        divContainer.style.opacity = "0.98";
        divContainer.style.display = "none";

        var div = document.createElement('div');
        div.style.position = 'absolute';
        let wkMedia = JSON.parse(document.getElementById("wix-viewer-model").textContent).formFactor;
        if (wkMedia && wkMedia == "mobile") {
            div.style.left = '68%';
        } else {
            div.style.left = '50%';
        }
        div.style.top = '50%';
        div.style.zIndex = '9999';
        div.style.height = '30px';
        div.style.width = '30px';
        div.style.margin = '-76px 0 0 -76px';
        div.style.border = '5px solid #e1e1e1';
        div.style.borderRadius = '50%';
        div.style.borderTop = '5px solid #2196f3';

        div.animate(
            [
                { transform: 'rotate(0deg)' },
                { transform: 'rotate(360deg)' }
            ],
            {
                duration: 2000,
                iterations: Infinity
            }
        );

        if (!this.__loader) {
            divContainer.appendChild(div);
            this.__loader = divContainer;
            document.body.appendChild(this.__loader);
        }
    }

    hideLoader() {
        if (this.__loader !== null) {
            this.__loader.style.display = "none";
        }
    }

    showLoader() {
        console.log(this.__loader);
        if (this.__loader !== null) {
            this.__loader.style.display = "block";
        }
    }
}

const wixEstimatedDeliverySlotEvent = new WixEstimatedDeliverySlotEvent();
wixEstimatedDeliverySlotEvent.init();    
