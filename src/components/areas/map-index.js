import React from 'react';

import { getBounds, createMap, setAreas, getGroupBounds, defineContextMenu } from '../helpers/maps';

import AreaNew from './area-new';
import AreaUpdate from './area-update';

//can you write your own react style listeners?

class MapIndex extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.state = {
            overlay: null,
            coords: null,
            editCoords: null,
            areaPolygons: null,
            areaNewFormShown: false,
            drawingManager: null,
            drawingModeActive: false,
            map: null,
            groupMarkers: null,
            autocomplete: null,
            editableArea: null,
            editableAreaId: undefined,
            settingsModalShown: false,
            isInitialized: false,
            overlayContextMenu: null,
            areaContextMenu: null,
            groupSelected: ''
        };
        
        this.goToGroup = this.goToGroup.bind(this);
        this.toggleProp = this.toggleProp.bind(this);
        this.closeCreateArea = this.closeCreateArea.bind(this);
        this.closeUpdateArea = this.closeUpdateArea.bind(this);
        
        //build get bounds function
        window.google.maps.Polygon.prototype.getBounds = getBounds(window.google.maps);
    }
    
    componentDidMount() {
        //component must be mounted to reference the map element
        this.setState({ map: createMap(window.google.maps) });
    }
    
    componentDidUpdate(prevProps, prevState) {
        
        //=====================
        // set as helper
        //=====================
        
        const areaContextSetup = (areaPolygons) =>{
            for (let poly in areaPolygons) {
                
                areaPolygons[poly].polygon.addListener('rightclick', e => {
                    
                    if (this.state.areaContextMenu) this.state.areaContextMenu.setMap(null);
                    
                    const areaContextMenu = defineContextMenu(
                            new window.google.maps.LatLng(e.latLng.lat(), e.latLng.lng()),
                            'Edit'
                        );
                    
                    //should set area context menu state to null here but then it triggers the poly click
                    areaContextMenu.addListener('click', () => {
                        if (this.state.editableArea) this.state.editableArea.polygon.setEditable(false);
                        if (this.state.overlay) this.state.overlay.setMap(null);
                        if (this.state.drawingModeActive) this.state.drawingModeActive
                        areaContextMenu.setMap(null);
                        areaPolygons[poly].polygon.setEditable(true);
                        this.setState({
                            editableArea: areaPolygons[poly],
                            editableAreaId: poly,
                            editCoords: areaPolygons[poly].polygon.getPath().getArray(),
                            drawingModeActive: false,
                            areaNewFormShown: false,
                            coords: null,
                            overlay: null
                            //, areaContextMenu: null
                        });
                    });
                    
                    areaContextMenu.setMap(this.state.map);
                    
                    this.setState({ areaContextMenu });
                });
                
                areaPolygons[poly].polygon.addListener('click', e => {
                    //map.fitBounds(areaPolygons[area._id].bounds))
                    
                    if (!this.state.areaContextMenu) {
                        areaPolygons[poly].infowindow.open(this.state.map);
                    } else {
                        this.state.areaContextMenu.setMap(null);
                        this.setState({ areaContextMenu: null });
                    }
                });
                
            }
        };
        
        //=====================
        
        if (!this.state.isInitialized) {
            const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('map-search'));
            //const groupPositions = {};
            //const groupMarkers = {};
            const areaPolygons = setAreas(this.props.areas, this.state.map);
            
            areaContextSetup(areaPolygons);
                
            autocomplete.addListener('place_changed', () => {
                let place = autocomplete.getPlace();
                
                //update the alert to be flash message
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert('No details available for input: "' + place.name + '"');
                    return;
                }
                
                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    this.state.map.fitBounds(place.geometry.viewport);
                } else {
                    this.state.map.setCenter(place.geometry.location);
                    this.state.map.setZoom(15);
                }
            });
            
            const drawingManager = new window.google.maps.drawing.DrawingManager({
                drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false,
                polygonOptions: {
                    editable: true
                }
            });
            
            drawingManager.setMap(this.state.map);
            drawingManager.setDrawingMode(null);
            
            //rename overlay to polygon or new polygon or something in all cases
            drawingManager.addListener('overlaycomplete', e => {
                
                if (this.state.overlay) this.state.overlay.setMap(null);
                
                //pass coords do area new
                this.setState({ drawingModeActive: false, coords: e.overlay.getPath().getArray(), overlay: e.overlay });
            });
            
            this.setState({
                autocomplete,
                areaPolygons,
                drawingManager,
                isInitialized: true
            });
        }
        
        if (prevProps.areas !== this.props.areas) {
            
            //clear map
            for (let poly in this.state.areaPolygons) {
                this.state.areaPolygons[poly].polygon.setMap(null);
            }
            
            const areaPolygons = setAreas(this.props.areas, this.state.map);
            
            areaContextSetup(areaPolygons);
            
            this.setState({ areaPolygons });
        }
        
        if (prevState.overlay !== this.state.overlay) {
            const setCoords = () => this.setState({ coords: this.state.overlay.getPath().getArray() });
            
            if (this.state.overlay) {
                window.google.maps.event.addListener(this.state.overlay.getPath(), 'insert_at', setCoords);
                window.google.maps.event.addListener(this.state.overlay.getPath(), 'set_at', setCoords);
                window.google.maps.event.addListener(this.state.overlay.getPath(), 'remove_at', setCoords);
                
                this.state.overlay.addListener('rightclick', e => {
                    //add this stuff to the helper
                    
                    if (this.state.overlayContextMenu) this.state.overlayContextMenu.setMap(null);
                    const overlayContextMenu = defineContextMenu(
                            new window.google.maps.LatLng(e.latLng.lat(), e.latLng.lng()),
                            'Reset'
                        );
                    
                    overlayContextMenu.addListener('click', () => {
                        overlayContextMenu.setMap(null);
                        this.state.overlay.setMap(null);
                    });
                    
                    overlayContextMenu.setMap(this.state.map);
                    
                    this.setState({ overlayContextMenu });
                });
                
                this.state.overlay.addListener('click', e => {
                    if (this.state.overlayContextMenu) {
                        this.state.overlayContextMenu.setMap(null);
                        this.setState({ overlayContextMenu: null });
                    }
                });
                
            }
        }
        
        if (prevState.drawingModeActive !== this.state.drawingModeActive) {
            const drawingMode = this.state.drawingModeActive ? window.google.maps.drawing.OverlayType.POLYGON : null;
            this.state.drawingManager.setDrawingMode(drawingMode);
            if (this.state.drawingModeActive) {
                if (this.state.editableArea) this.state.editableArea.polygon.setEditable(false);
                this.setState({
                    areaNewFormShown: true,
                    editableArea: null,
                    editCoords: null,
                    editableAreaId: undefined
                });
            }
        }
        
        if (prevState.editableArea !== this.state.editableArea) {
            if (this.state.editableArea) {
                const setCoords = () => this.setState({ editCoords: this.state.editableArea.polygon.getPath().getArray() });
            
                window.google.maps.event.addListener(this.state.editableArea.polygon.getPath(), 'insert_at', setCoords);
                window.google.maps.event.addListener(this.state.editableArea.polygon.getPath(), 'set_at', setCoords);
                window.google.maps.event.addListener(this.state.editableArea.polygon.getPath(), 'remove_at', setCoords);
            }
        }
    }
    
    goToGroup(groupId) {
        const groupPolygons = [];
        this.props.areas.forEach(area => {
            
            if (area.areaGroupId === groupId) {
                groupPolygons.push(this.state.areaPolygons[area._id]);
            }
        });
        
        //maybe run this in component did update on group selected change
        this.state.map.fitBounds(getGroupBounds(groupPolygons));
        
        this.setState({ groupSelected: groupId });
    }
    
    closeCreateArea() {
        if (this.state.overlay) this.state.overlay.setMap(null);
        this.setState({ areaNewFormShown: false, overlay: null, drawingModeActive: false })
    }
    
    closeUpdateArea() {
        if (this.state.editableArea) this.state.editableArea.polygon.setEditable(false);
        this.setState({ editableAreaId: undefined, editableArea: null });
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }

    render() {
        const {
            props: { areaGroups, clearAreas, fetchAreas },
            state: { drawingModeActive, areaNewFormShown, coords, editCoords, groupSelected, editableArea, editableAreaId },
            goToGroup, toggleProp, closeCreateArea, closeUpdateArea
        } = this;
        
        return (
            <div>
                <div className={ `map-container ${ this.props.mapShown ? '' : 'invisible' }` }>
                    <div style={{ display: 'flex' }}>
                        <button onClick={ toggleProp('drawingModeActive') } className={ drawingModeActive ? 'button success' : 'button cancel' }>
                            <i className="fas fa-pencil-alt"></i>
                        </button>
                        <input id="map-search" type="text" placeholder="enter location to go to" className="map-input" style={{ width: '100%'}} />
                    </div>
                    <div id="map"></div>
                    { areaNewFormShown ? (<AreaNew  //just use drawingModeActive and remove areaNewFormShown
                            coords={ coords }
                            close={ closeCreateArea }
                            clearAreas={ clearAreas }
                            fetchAreas={ fetchAreas }
                            groupSelected={ groupSelected }
                        />) : '' }
                    { editableArea ? (<AreaUpdate
                            id={ editableAreaId }
                            coords={ editCoords }
                            random={ Math.random() }
                            close={ closeUpdateArea }
                            clearAreas={ clearAreas }
                            fetchAreas={ fetchAreas }
                            groupSelected={ groupSelected }
                        />) : '' }
                    
                    <h4>Go To Group</h4>
                    <select onChange={ (e) => goToGroup(e.target.value) }>
                        <option value="">Go to Group</option>
                        {
                            areaGroups.map(group => {
                                return (
                                    <option key={ group._id } value={ group._id }>{ group.title }</option>
                                );
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default MapIndex;