
// 주소-좌표 변환 객체를 생성합니다

var latitude;
var longitude;

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            latitude= position.coords.latitude
            longitude =position.coords.longitude
            
           
            var moveLatLon = new kakao.maps.LatLng(latitude, longitude);
            var coord = new kakao.maps.LatLng(latitude, longitude);
            var geocoder = new kakao.maps.services.Geocoder();
            var callback = function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    $('#postaddress').val(result[0].address.address_name);
                    
                }
                var goo = result[0].address.address_name.split(" ");
                $('#status_address').val(goo[1]);
                
                console.log(goo[1]);
                
            };
            
            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
            ps.keywordSearch("코인노래방", placesSearchCB, {location: new kakao.maps.LatLng(latitude, longitude)});
                // 중심 이동
            map.setCenter(moveLatLon);
        })
    }else{
        alert('GPS를 지원하지 않습니다.')
    }
} 

$(document).on('click', '#now_address', function () {
    var coord = new kakao.maps.LatLng(latitude, longitude);
    var geocoder = new kakao.maps.services.Geocoder();
    var callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            $('#postaddress').val(result[0].address.address_name);
            
        }
        var goo = result[0].address.address_name.split(" ");
        
        
        console.log(goo[1]);
        
    };
    
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    //alert(result);
    $('#postlatitude').val(latitude);
    $('#postlongitude').val(longitude);
    event.preventDefault();
})


// 마커를 담을 배열입니다
var markers = [];


var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(33.452613, 126.570888), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
};  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();  

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// 키워드로 장소를 검색합니다
searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

    var keyword = document.getElementById('keyword').value ;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword +"코인노래방", placesSearchCB, {location: new kakao.maps.LatLng(latitude, longitude)}); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {

    if (status === kakao.maps.services.Status.OK) {
       
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
        console.log(data)
        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
   
    
    var listEl = document.getElementById('placesList'),
    // location = new kakao.maps.LatLng(37.5429964, 127.0999344),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    
    //console.log(location, bounds)
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();
    /*
    var newPlaces = [];
    for (var place of places) {
        var dx = Math.abs(longitude - place.x)
        var dy = Math.abs(latitude - place.y)
        newPlaces.push(place)
        

    }
    places = [places[0],places[2]]
    places = newPlaces
    */  
   
    for ( var i=0; i<places.length; i++ ) {
        
        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x)
            
            marker = addMarker(placePosition, i , places[i]) 
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
          
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);
        
        
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title, id,x,y,place_url,phone, address_name) {
                
                function handler() {
                   
                    var place_position = marker.getPosition()
                    
                    console.log(place_position)
                    
                    console.log(x +" " + y)
                    console.log(garaokay)
                    console.log(title)
                    
                    $.ajax({
                        url: garaokay,
                        method: 'POST',
                        headers: { "X-CSRFToken": token },
                        data: {
                            place_id: id,
                            place_title: title,
                            place_x: y,
                            place_y: x,
                            // csrfmiddlewaretoken: '{{csrf_token}}'
                        },
                        success: function (data) {
                            
                            //alert(data);
                            
                        },
                        error: function (data) {
                            console.log(data)
                        }
                    })
                    if (!isAnyOverlay) {//isAnyOverlay: 창이 떠있는지..
                    
                        overlay = displayInfowindow(marker, title, x, y, place_url, phone, address_name);
                        
                        var closeBtn = document.querySelector('#closeBtn');
                        isAnyOverlay = true;
                        closeBtn.addEventListener('click', function () {
                            
                            isAnyOverlay = false;
                            overlay.setMap(null);
                            marker.setClickable(true);
                        })

                    marker.setClickable(false);
                    } else {
                        
                        overlay.setMap(null);  
                        
                        marker.setClickable(true);
                        overlay = displayInfowindow(marker, title, x, y, place_url, phone, address_name);
                        var closeBtn = document.querySelector('#closeBtn');
                        isAnyOverlay = true;
                        closeBtn.addEventListener('click', function () {
                            isAnyOverlay = false;
                            overlay.setMap(null);
                            marker.setClickable(true);
                        })
                        
                        }             
                };
            kakao.maps.event.addListener(marker, 'click', handler)
            
            
        })(marker, places[i].place_name, places[i].id,places[i].x,places[i].y,places[i].place_url,places[i].phone,places[i].address_name);
        
        fragment.appendChild(itemEl);
    }


   
    

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    const a = document.createElement('div')
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}



// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
    
    var el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray">' +  places.address_name  + '</span>';
    } else {
        itemStr += '    <span>' +  places.address_name  + '</span>'; 
    }
                    
        itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}


// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx) {
    
    var imageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage,
             
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
var isAnyOverlay = false;

function displayInfowindow(marker, title, x, y, place_url, phone, address_name) {
        
        
        
        var content = '<div class="wrap">' + 
        '    <div class="info">' + 
        '        <div class="title" style="background-color:#F5ECCE">' + 
        '           ' + title +
        '            <div class="close" id="closeBtn" title="닫기"></div>' + 
        '        </div>' + 
        '        <div class="body">' + 
        '            <div class="img">' +
        '                <img src="'+coinimg+'" width="73" height="70">' +
        '           </div>' + 
        '            <div class="desc">' + 
        '                <div class="ellipsis">'+ address_name + 
        '                <div class="jibun ellipsis">'+ phone + 
        '                <div><a href="' + place_url + '" target="_blank" class="link">홈페이지</a>' + 
        '                <div class="jibun ellipsis float-center mt-1"><button id="wirte_post" type="button" class="btn btn-primary btn-sm" style="color:#ffffff;"> 글쓰러 가기</button>' +
        '            </div>' + 
        '        </div>' + 
        '    </div>' +    
        '</div>';

        $(document).on('click', '#wirte_post', function () {
               
            $('#postaddress').val(address_name);                 
            $('#postlatitude').val(y);
            $('#postlongitude').val(x);
            // event.preventDefault();

        })

        
        var position = new kakao.maps.LatLng(y, x);
        
        var overlay = new kakao.maps.CustomOverlay({
                content: content,
                map: map,
                position: position                
            });

        
        
    
        return overlay
      
    //infowindow.setContent(content);
    //infowindow.open(map, marker);
}





    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// {% comment %} var audio = document.getElementById("audio_preview");

// navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
// navigator.getUserMedia({video: false, audio: true}, function(stream) {
// audio.src = window.URL.createObjectURL(stream);
// }, onRecordFail);

// var onRecordFail = function (e) {
// console.log(e);
// }


var currentPosition = parseInt($("#sidebox").css("top"));
$(window).scroll(function() { var position = $(window).scrollTop(); $("#sidebox").stop().animate({"top":position+currentPosition+"px"},1000); });
$(document).ready(function(){
    getLocation();
})

