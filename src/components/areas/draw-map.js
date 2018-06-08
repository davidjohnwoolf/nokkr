import React from 'react';
import mapStyles from '../helpers/map-styles';

//can you write your own react style listeners?

class DrawMap extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        this.autocomplete = null;
        this.drawingManager = null;
        
        //maybe move overlay to state
        this.overlay = null;
        
        this.resetMap = this.resetMap.bind(this);
    }
    
    componentDidMount() {
        
        const map = new google.maps.Map(document.getElementById('area-new-map'), {
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
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(15);
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
        
        this.drawingManager.setMap(map);
    }
    
    resetMap() {
        this.overlay.setMap(null);
        this.props.handleOverlay(null);
    }

    render() {
        
        return (
            <div className="area-new-map-constainer">
                <input id="area-new-map-search" type="text" placeholder="enter location to start" />
                <div id="area-new-map"></div>
                <button className="btn btn-warning" onClick={ this.resetMap }>Reset</button>
            </div>
        );
    }
}

export default DrawMap;