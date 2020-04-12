
var map;
var markers=[];
var infoWindow;
var userLoc;

function setOnClicksetListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function initMap() 
{
    
    var losAngeles = {
        lat: 34.063380, 
        lng: -118.358080
        };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        
        });
    infoWindow = new google.maps.InfoWindow();
    

}

function displayStores()
{
    var storesHtml='';
    var search_input=document.getElementById('zip-code-input').value;
    for(var [index,store] of stores.entries())
    {
        var address=store['addressLines'];
        var postalCode=store['address']['postalCode'];
        var phone=store['phoneNumber'];
        if(search_input==postalCode.substr(0,5))
        {
            storesHtml+=`
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container" >
                        <div class="store-address" onclick="${setOnClicksetListener()}">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.querySelector('.stores-list').innerHTML = storesHtml;
        }
    }
    

}

function showStoresMarkers()
{
    var bounds=new google.maps.LatLngBounds();
    var search_input=document.getElementById('zip-code-input').value;
    var patt=/\d{5}/;
    if(!patt.test(search_input))
    {
         alert("Invalid zipcode");
    }
    for(var [index, store] of stores.entries()){
        var postalCode=store['address']['postalCode'];
        index+=1;
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var opens=store["openStatusText"];
        var phoneNumber=store['phoneNumber'];
        if(search_input==postalCode.substr(0,5))
        {
            bounds.extend(latlng);
            createMarker(latlng, name, address, opens, phoneNumber, index)
        }

}
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
    var t=name.replace(' ','+');
    
    var directionQuery=`https://www.google.com/maps/dir/?api=1&destination=${t}&travelmode=driving`;//&origin=${userLoc}
    var html = `
        <div class="store-info-window" >
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${phoneNumber}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                <i class="far fa-compass"></i>
                </div>
                <a href="${directionQuery}">Directions</a>
            </div>
        </div>
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      animation: google.maps.Animation.DROP,
      icon: "http://maps.google.com/mapfiles/ms/micons/coffeehouse.png",//google.maps.SymbolPath.CIRCLE
      label: index.toString(),
    });
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
    marker.addListener('mouseover', toggleBounce);
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(latlng);
}
function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}
//setOnClickListener();
 //markers.push(latlng);
/*window.onload=function(){
    displayStores();
}
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} 
else { 
    alert("Geolocation is not supported by this browser.") ;
}
function showPosition(position) {
    userLoc =  position.coords.latitude +","+ position.coords.longitude;
  }


*/

//var html = "<b>" + name + "</b> <br/>" + "<b>" +address+ "</b> <br/>" +"<b>" +opens+ "</b> <br/>"+`<a href=${directionQuery}>directions</a>`;
    

// origin=Space+Needle+Seattle+WA&


