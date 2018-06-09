import React from 'react';
import mapStyles from '../helpers/map-styles';

//can you write your own react style listeners?

class DrawMap extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        //think of a different patter for this
        this.autocomplete = null;
        this.drawingManager = null;
        this.map = null;
        
        //maybe move overlay to state
        this.overlay = null;
        this.areaPolygons = {};
        
        this.resetMap = this.resetMap.bind(this);
        this.showAreas = this.showAreas.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.renderAreaOptions = this.renderAreaOptions.bind(this);
    }
    
    componentDidMount() {
        
        //maps no longer supports getBounds so we construct our own
        google.maps.Polygon.prototype.getBounds = function() {
            let bounds = new google.maps.LatLngBounds();
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
        
        this.map = new google.maps.Map(document.getElementById('area-new-map'), {
            center: {lat: 40, lng: -100},
            zoom: 4,
            styles: mapStyles
        });
        
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('area-new-map-search'));
        
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon']
            },
            polygonOptions: {
                //see if you can get this to update the coords
                //editable: true
            }
        });
        
        this.autocomplete.addListener('place_changed', () => {
            let place = this.autocomplete.getPlace();
            
            //update the alert to be flash message
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert('No details available for input: "' + place.name + '"');
                return;
            }
            
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(15);
            }
        });
        
        this.drawingManager.addListener('overlaycomplete', e => {
            
            if (this.overlay) {
                //ask to replace, or delete (line below)
                //move this to map click and ask there before the 2nd overlay is created
                //basically you need to make it so only one overlay is available
                this.overlay.setMap(null);
            }
        
            this.drawingManager.setDrawingMode(null);
            
            this.overlay = e.overlay;
            
            this.props.handleOverlay(this.overlay.getPath().getArray());
        });
        
        this.drawingManager.setMap(this.map);
        
        this.props.areas.forEach(area => {
            
            let areaPolygon = new google.maps.Polygon({
                paths: area.coords,
                strokeColor: 'red',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'red',
                fillOpacity: 0.35
            });
            
            this.areaPolygons[area._id] = {
                bounds: areaPolygon.getBounds(),
                center: areaPolygon.getBounds().getCenter(),
                polygon: areaPolygon
            }
            
            areaPolygon.addListener('click', () => this.map.fitBounds(this.areaPolygons[area._id].bounds));
        });
    }
    
    resetMap() {
        this.overlay.setMap(null);
        this.overlay = null;
        this.props.handleOverlay(null);
    }
    
    showAreas() {

        for (let poly in this.areaPolygons) {
            this.areaPolygons[poly].polygon.setMap(this.map);
        }
    }
    
    goToArea(e) {
        if (e.target.value) this.map.fitBounds(this.areaPolygons[e.target.value].bounds);
    }
    
    renderAreaOptions() {
        return this.props.areas.map(area => {
            
            return (
                <option key={ area._id } value={ area._id }>
                    { area.title } - { area.city }
                </option>
            );
        });
    }

    render() {
        
        const { resetMap, showAreas, goToArea, renderAreaOptions } = this;
        
        return (
            <div className="area-new-map-constainer">
                <input id="area-new-map-search" type="text" placeholder="enter location to go to" />
                <div id="area-new-map"></div>
                <select onChange={ e => goToArea(e) }>
                    <option value="">Go to Area</option>
                    { renderAreaOptions() }
                </select>
                <div className="btn-group">
                    <button className="btn btn-warning" onClick={ resetMap } disabled={ !this.overlay }>Reset</button>
                    <button className="btn btn-warning" onClick={ showAreas }>Show Current Areas</button>
                </div>
            </div>
        );
    }
}

export default DrawMap;