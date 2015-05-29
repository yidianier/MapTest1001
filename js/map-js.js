/* entrance */
window.onload = function() {	
	//Show temp map;
	showTempMap();
	
	if (window.DeviceMotionEvent) {
		document.getElementById("map-header").innerHTML = "shake1"
		window.addEventListener('devicemotion', deviceMotionHandler, false);
		document.getElementById("map-header").innerHTML = "shake2"
	} else {
		alert('not support mobile event');
	}
};

function showMap(value) {
	var searchText = "";
	var longitude = value.coords.longitude;  
    var latitude = value.coords.latitude; 
	
	searchText = document.getElementById("search");

    // Baidu Map API function
    var map = new BMap.Map("allmap");          
	var mapPoint = new BMap.Point(longitude+0.01085, latitude+0.00368);
    map.centerAndZoom(mapPoint, 13);
    map.addOverlay(new BMap.Marker(mapPoint));
    map.panTo(mapPoint);
	
	var circle = new BMap.Circle(mapPoint, 1000, {fillColor:"lightblue", strokeWeight: 1, fillOpacity: 0.3, strokeOpacity: 0.3});
    map.addOverlay(circle);
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, panel: "result", autoViewport: false}});
    //map.enableScrollWheelZoom(true);    
	local.clearResults();
	local.searchNearby(searchText, mapPoint,500);
}

function showTempMap() {
    // Baidu Map API function
    var map = new BMap.Map("allmap");          
	var mapPoint = new BMap.Point(113.42, 34.44);
    map.centerAndZoom(mapPoint, 5);
	//map.disableDragging();
	
	map.enableScrollWheelZoom();
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
}

function getLocation() {
	//Get geo location  
    if (navigator.geolocation) {  
	document.getElementById("map-header").innerHTML = "sha"
        navigator.geolocation.getCurrentPosition(showMap, handleError, { enableHighAccuracy: true, maximumAge: 1000 });  
    } else {  
        alert("您的浏览器不支持使用HTML 5来获取地理位置服务!");
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

function deviceMotionHandler(eventData) {
    var SHAKE_THRESHOLD = 3000;
    var last_update = 0;
    var x = y = z = last_x = last_y = last_z = 0;

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
			document.getElementById("map-header").innerHTML = "shake"
            getLocation();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}