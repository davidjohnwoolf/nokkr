import React from 'react';
import mapStyles from '../helpers/map-styles';

//can you write your own react style listeners?

class DrawMap extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        //think of a different pattern for this
        this.autocomplete = null;
        this.drawingManager = null;
        this.map = null;
        
        //maybe move overlay to state
        this.overlay = null;
        this.areaPolygons = {};
        
        this.state = {
            drawingMode: true
        }
        
        this.resetMap = this.resetMap.bind(this);
        //this.goToArea = this.goToArea.bind(this);
        this.renderAreaOptions = this.renderAreaOptions.bind(this);
        this.toggleDrawingMode = this.toggleDrawingMode.bind(this);
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
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40, lng: -100},
            zoom: 4,
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyles
        });
        
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('map-search'));
        
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            //drawingControlOptions: {
            //    drawingModes: ['polygon']
            //},
            //polygonOptions: {
                //see if you can get this to update the coords
                //editable: true
            //}
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
            
            this.toggleDrawingMode();
            
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
        
        //show areas
        for (let poly in this.areaPolygons) {
            this.areaPolygons[poly].polygon.setMap(this.map);
        }
    }
    
    resetMap() {
        this.overlay.setMap(null);
        this.overlay = null;
        this.props.handleOverlay(null);
    }
    
    toggleDrawingMode() {

        if (this.state.drawingMode) {
            this.drawingManager.setDrawingMode(null);
            this.setState({ drawingMode: false });
        } else {
            this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
            this.setState({ drawingMode: true });
        }
    }
    
    //goToArea(e) {
    //    if (e.target.value) this.map.fitBounds(this.areaPolygons[e.target.value].bounds);
    //}
    
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
        
        const { resetMap, goToArea, renderAreaOptions } = this;
        return (
            <div className="map-container">
                <div className="custom-map-controls">
                    <button onClick={ resetMap } disabled={ !this.overlay } className="btn btn-primary"><i className="fas fa-undo"></i></button>
                    <div><input id="map-search" type="text" placeholder="enter location to go to" /></div>
                    <button onClick={ this.toggleDrawingMode } className={ this.state.drawingMode ? 'btn btn-success' : 'btn btn-cancel' }><i className="fas fa-pencil-alt"></i></button>
                </div>
                <div id="map"></div>
                
                { /*<select onChange={ e => goToArea(e) }>
                    <option value="">Go to Area</option>
                    { renderAreaOptions() }
                </select> */ }
            </div>
        );
    }
}

export default DrawMap;