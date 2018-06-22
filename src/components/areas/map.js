import React from 'react';
import mapStyles from '../helpers/map-styles';

//can you write your own react style listeners?

class DrawMap extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        //think of a different patter for this
        this.map = null;
        
        //maybe move overlay to state
        this.areaPolygons = {};
        
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
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40, lng: -100},
            zoom: 4,
            styles: mapStyles
        });
        
        this.props.areas.forEach(area => {
            
            let areaPolygon = new google.maps.Polygon({
                paths: area.coords,
                strokeColor: 'black',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'black',
                fillOpacity: 0.35
            });
            
            areaPolygon.setMap(this.map);
            
            this.areaPolygons[area._id] = {
                bounds: areaPolygon.getBounds(),
                center: areaPolygon.getBounds().getCenter(),
                polygon: areaPolygon
            }
            
        });
        
        console.log(this.map)
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
        
        const { goToArea, renderAreaOptions } = this;
        
        return (
            <div className="map-constainer">
                <div id="map"></div>
                <section className="content">
                    <div className="btn-group">
                        <select onChange={ e => goToArea(e) }>
                            <option value="">Go to Area</option>
                            { renderAreaOptions() }
                        </select>
                        <button className="btn btn-primary">Use Location</button>
                    </div>
                </section>
            </div>
        );
    }
}

export default DrawMap;