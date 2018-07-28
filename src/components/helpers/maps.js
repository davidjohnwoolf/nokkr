import mapStyles from './map-styles';

export const getBounds = googleMaps => {
    return function() {
        let bounds = new googleMaps.LatLngBounds();
        let paths = this.getPaths();
        let path;
        for (let i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            
            for (let ii = 0; ii < path.getLength(); ii++) {
                bounds.extend(path.getAt(ii));
            }
        }
        return bounds;
    };
};

export const getGroupBounds = groupPolygons => {
    let bounds = new window.google.maps.LatLngBounds();
    
    for (let i = 0; i < groupPolygons.length; i++) {
        let paths = groupPolygons[i].polygon.getPaths();
        let path;
        for (let j = 0; j < paths.getLength(); j++) {
            path = paths.getAt(j);
            
            for (let j = 0; j < path.getLength(); j++) {
                bounds.extend(path.getAt(j));
            }
        }
    }
    
    return bounds;
};

/*export const getGroupBounds = (areaPolygons) => {
    var bounds = new window.google.maps.LatLngBounds();
    for (let poly in areaPolygons){
            let paths = areaPolygons[poly].getPaths();
             paths.forEach(function(path){
               var ar = path.getArray();
               for(var i=0, l = ar.length; i <l; i++){
                  bounds.extend(ar[i]);
                }
            })
     }
     
     return bounds;
     //map.fitBounds(bounds)
 }*/

export const createMap = googleMaps => {
    return new googleMaps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -100},
        zoom: 4,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        styles: mapStyles
    });
};

export const setArea = ({ googleMaps, areas, id, map }) => {
    const areaCoords = areas.find(area => area._id === id).coords;
    const polygon = new googleMaps.Polygon({ paths: areaCoords });
    const outerBounds = [
        new googleMaps.LatLng(85, 180),
        new googleMaps.LatLng(85, 90),
        new googleMaps.LatLng(85, 0),
        new googleMaps.LatLng(85, -90),
        new googleMaps.LatLng(85, -180),
        new googleMaps.LatLng(0, -180),
        new googleMaps.LatLng(-85, -180),
        new googleMaps.LatLng(-85, -90),
        new googleMaps.LatLng(-85, 0),
        new googleMaps.LatLng(-85, 90),
        new googleMaps.LatLng(-85, 180),
        new googleMaps.LatLng(0, 180),
        new googleMaps.LatLng(85, 180)
    ];
    //overlay for everything but area
    //create world area with hole that is real area
    const outerPolygon = new googleMaps.Polygon({
        paths: [outerBounds, areaCoords],
        strokeColor: 'red',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: 'black',
        fillOpacity: 0.5
    });
    const areaPolygon = {
        bounds: polygon.getBounds(),
        center: polygon.getBounds().getCenter(),
        polygon: polygon
    };
    
    //show area overlay
    outerPolygon.setMap(map);
    
    //set area bounds
    map.fitBounds(areaPolygon.bounds);
    
    return { outerPolygon, areaPolygon };
};

export const setPosition = ({ position, positionMarker, positionWatcher, map }) => {
    const result = { settingPosition: true, locationActive: true };
    let currentPositionMarker;
    
    if (!positionMarker) {
        currentPositionMarker = new window.google.maps.Marker({
            map: map,
            position: new window.google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            ),
            title: 'You are here',
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor: '#306eff',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                strokeOpacity: 1,
                radius: 20
            }
        });
        
        //accuracy circle
        /*const circle = new window.google.maps.Circle({
            center: new window.google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            ),
            radius: position.coords.accuracy,
            map,
            fillColor: '#306eff',
            fillOpacity: 0.2,
            strokeColor: '#306eff',
            strokeWeight: 1,
            strokeOpacity: 0.5
        });*/
    }
    
    if (currentPositionMarker) result.positionMarker = currentPositionMarker;
    
    if (!positionWatcher) {
        result.positionWatcher = window.navigator.geolocation.watchPosition(position => {
            (positionMarker || result.positionMarker).setPosition(
                new window.google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
                )
            );
        });
    }
    
    return result;
};

export const locationError = err => {
    console.log(err);
    alert('Error finding location');
};

export const setAreas = (areas, map) => {
    const areaPolygons = {};
    
    areas.forEach(area => {
        
        let areaPolygon = new window.google.maps.Polygon({
            paths: area.coords,
            strokeColor: area.areaGroup.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: area.areaGroup.color,
            fillOpacity: 0.35
        });
        
        let infowindow = new window.google.maps.InfoWindow({
          content: `<h4>${ area.title }</h4><p>Group: ${ area.areaGroup.title }</p><p>Assigned User: ${ area.assignedUserName }</p><p>Times Knocked: ${ area.timesKnocked }</p>`,
          position: areaPolygon.getBounds().getCenter()
        });
        
        areaPolygon.addListener('click', e => {
            //map.fitBounds(areaPolygons[area._id].bounds))
            infowindow.open(map);
            
        });
        
        areaPolygons[area._id] = {
            bounds: areaPolygon.getBounds(),
            center: areaPolygon.getBounds().getCenter(),
            polygon: areaPolygon
        };
        
        return areaPolygons;
        
        //areaPolygon.addListener('click', () => map.fitBounds(areaPolygons[area._id].bounds));
        
    });
    
    //show areas
    for (let poly in areaPolygons) {
        areaPolygons[poly].polygon.setMap(map);
    }
    
    return areaPolygons;
}

export const defineContextMenu = (pos, title) => {
    class ContextMenu {
        constructor(position) {
            this.position = position;
            
            //just add class for the styles
            this.menu = document.createElement('div');
            this.menu.innerHTML = title;
            this.menu.style.backgroundColor = '#fff';
            this.menu.style.padding = '1rem';
            this.menu.style.display = 'block';
            this.menu.style.position = 'absolute';
            this.menu.style.cursor = 'pointer';
            
            window.google.maps.event.addDomListener(this.menu, 'click', () => {
                window.google.maps.event.trigger(this, 'click');
            });
        }
        
        onAdd() {
            this.getPanes().overlayMouseTarget.appendChild(this.menu);
            
            
        }
        
        draw() {
            let divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
    
            this.menu.style.left = divPosition.x + 'px';
            this.menu.style.top = divPosition.y + 'px';
    
        }
        
        onRemove() {
            if (this.menu.parentElement) {
                this.menu.parentElement.removeChild(this.menu);
            }
        }
    }
    
    Object.setPrototypeOf(ContextMenu.prototype, window.google.maps.OverlayView.prototype);
    
    return new ContextMenu(pos);
}