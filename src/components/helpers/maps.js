import mapStyles from './map-styles';

export const getBounds = googleMaps => {
    return function() {
        let bounds = new googleMaps.LatLngBounds();
        let paths = this.getPaths();
        let path;
        for (var i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            
            for (var ii = 0; ii < path.getLength(); ii++) {
                bounds.extend(path.getAt(ii));
            }
        }
        return bounds;
    };
};

export const createMap = googleMaps => {
    return new googleMaps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -100},
        zoom: 4,
        disableDefaultUI: true,
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
        strokeWeight: 2,
        fillColor: 'black',
        fillOpacity: 0.3
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
                strokeOpacity: 1
            }
        });
    }
    
    if (currentPositionMarker) result.positionMarker = currentPositionMarker;
    
    if (!positionWatcher) {
        result.positionWatcher = window.navigator.geolocation.watchPosition(position => {
            positionMarker.setPosition(
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