/* entrance */
window.onload = function() {	
	//Show temp map;
	showTempMap();
		
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('Cannot support the mobile event!');
	}
	
	document.getElementById("searchBtn").onclick = function() {	
		searchMap("");
	};
	
	document.getElementById("li-js1").onclick = function() {
		searchMap("美食");
	};
	document.getElementById("li-js2").onclick = function() {
		searchMap("酒店");
	};
	document.getElementById("li-js3").onclick = function() {
		searchMap("银行");
	};
	document.getElementById("li-js4").onclick = function() {
		searchMap("公交站");
	};
};

var SHAKE_THRESHOLD = 1500;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

var searchText = "";

function showMap(value) {
	var longitude = value.coords.longitude;  
    var latitude = value.coords.latitude; 
	
    // Baidu Map API function
    var map = new BMap.Map("allmap");          
	var mapPoint = new BMap.Point(longitude+0.01085, latitude+0.00368);
    map.centerAndZoom(mapPoint, 15);
    map.addOverlay(new BMap.Marker(mapPoint));
    map.panTo(mapPoint);
	
	map.enableScrollWheelZoom(); 
	map.disableDragging();
	
	var circle = new BMap.Circle(mapPoint, 1000, {fillColor:"lightblue", strokeWeight: 1, fillOpacity: 0.3, strokeOpacity: 0.3});
    map.addOverlay(circle);
	
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, panel: "result", autoViewport: false}});
	
	local.clearResults();
	local.searchNearby(searchText, mapPoint, 500);
}

function showTempMap() {
    // Baidu Map API function
    var map = new BMap.Map("allmap");          
	var mapPoint = new BMap.Point(113.42, 34.44);
    map.centerAndZoom(mapPoint, 5);
	map.disableDragging();	
	map.enableScrollWheelZoom();
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
}

function getLocation() {
	//Get geo location  
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showMap, handleError, { enableHighAccuracy: true, maximumAge: 1000 });  
    } else {  
        alert("Your browser cannot support the geo-location service by HTML5!");
    }
}

function handleError(value) {  
    switch (value.code) {  
        case 1:  
            alert("位置服务被拒绝"); 
            break;  
        case 2:  
            alert("暂时获取不到位置信息");  
            break;  
        case 3:  
            alert("获取信息超时");  
            break;  
        case 4:  
            alert("未知错误");  
            break;
        default:
            break;
    }  
}

function searchMap(searchValue) {
	if (searchValue == "") {
		searchText = document.getElementById("search").value;
	} else {
		searchText = searchValue;
	}	
	getLocation();
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            searchMap("");
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}