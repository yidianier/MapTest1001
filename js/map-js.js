/* entrance */
window.onload = function() {
	
	//Show temp map;
	showTempMap();
	
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('not support mobile event');
	}
};

function showMap(value) {
	var longitude = value.coords.longitude;  
    var latitude = value.coords.latitude; 

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
    map.centerAndZoom(mapPoint, 7);
	//map.disableDragging();
	
	map.enableScrollWheelZoom();
    var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
}

function getLocation() {
	//Get geo location  
    if (navigator.geolocation) {  
        navigator.geolocation.getCurrentPosition(showMap, handleError, { enableHighAccuracy: true, maximumAge: 1000 });  
    } else {  
        alert("�����������֧��ʹ��HTML 5����ȡ����λ�÷���!");  
    }  
}

function handleError(value) {  
    switch (value.code) {  
        case 1:  
            alert("λ�÷��񱻾ܾ�");  
            break;  
        case 2:  
            alert("��ʱ��ȡ����λ����Ϣ");  
            break;  
        case 3:  
            alert("��ȡ��Ϣ��ʱ");  
            break;  
        case 4:  
            alert("δ֪����");  
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
            getLocation();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}