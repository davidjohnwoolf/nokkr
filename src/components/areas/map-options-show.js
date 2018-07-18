import React from 'react';


const MapOptionsShow = ({ mapType, setMapType, toggleOverlay, overlayShown }) => {

    return (
        <section className="area-settings">
            <div className="button-toggle">
                <button onClick={ () => setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                <button onClick={ () => setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                <button onClick={ () => setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
            </div>
            
            <div className="checkbox-options">
                <div>
                    <label htmlFor="show-leads">Show Leads</label>
                    <input type="checkbox" id="show-leads" value="true" defaultChecked />
                </div>
                <div>
                    <label htmlFor="show-area">Show Area Overlay</label>
                    <input type="checkbox" id="show-area" value="true" checked={ overlayShown } onChange={ toggleOverlay } />
                </div>
            </div>
            <button className="button primary">Edit Area</button>
        </section>
    );
};

export default MapOptionsShow;