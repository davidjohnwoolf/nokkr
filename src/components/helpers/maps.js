import mapStyles from './map-styles';

export const getBounds = (googleMaps) => {
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
    }
};

export const createMap = (googleMaps) => {
    return new googleMaps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -100},
        zoom: 4,
        disableDefaultUI: true,
        zoomControl: true,
        styles: mapStyles
    });
}

export const createOuterPolygon = (googleMaps, areaPath) => {
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
    
    return new googleMaps.Polygon({
        paths: [outerBounds, areaPath],
        strokeColor: 'black',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'black',
        fillOpacity: 0.25
    });
}