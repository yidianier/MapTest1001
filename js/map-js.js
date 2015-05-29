/* entrance */
window.onload = function() {	
	//Show temp map;
	showTempMap();
	
	showSHTempMap();
		
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('Cannot support the mobile event!');
	}
	
	document.getElementById("searchBtn").onclick = function() {		
		searchText = document.getElementById("search").value;
		searchMap();
	};
	
	document.getElementById("li-js1").onclick = function() {
		searchText = "美食";
		searchMap();
	};
	document.getElementById("li-js2").onclick = function() {
		searchText = "酒店";
		searchMap();
	};
	document.getElementById("li-js3").onclick = function() {
		searchText = "银行";
		searchMap();
	};
	document.getElementById("li-js4").onclick = function() {
		searchText = "公交站";
		searchMap();
	};
};

var SHAKE_THRESHOLD = 1500;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

var searchText = "美食";

function showMap(value) {	
	var longitude = value.coords.longitude;  
    var latitude = value.coords.latitude; 
	
    // Baidu Map API function
    var map = new BMap.Map("allmap");          
	var mapPoint = new BMap.Point(longitude+0.01085, latitude+0.00368);
    map.centerAndZoom(mapPoint, 15);
    map.addOverlay(new BMap.Marker(mapPoint));
    map.panTo(mapPoint);
	
	var circle = new BMap.Circle(mapPoint, 1000, {fillColor:"lightblue", strokeWeight: 1, fillOpacity: 0.3, strokeOpacity: 0.3});
    map.addOverlay(circle);
	
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, panel: "result", autoViewport: false}});
		
	map.enableScrollWheelZoom(); 
	map.disableDragging();
	
	local.clearResults();
	local.searchNearby(searchText, mapPoint, 800);
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

function showSHTempMap() {
    // Baidu Map API function
    var map = new BMap.Map("result");          
	var mapPoint = new BMap.Point(121.48, 31.22);
    map.centerAndZoom(mapPoint, 11);
	map.disableDragging();	
	map.enableScrollWheelZoom();
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
	local.searchNearby(searchText, mapPoint, 800);
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

function searchMap() {	
	if (searchText == "") {
		searchText = "小吃";
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
            searchMap();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}