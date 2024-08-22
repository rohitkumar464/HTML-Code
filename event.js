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

