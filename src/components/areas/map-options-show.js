import React from 'react';


const MapOptionsShow = ({ mapType, setMapType }) => {

    return (
        <section className="area-settings">
            <div className="button-toggle">
                <button onClick={ () => setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                <button onClick={ () => setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                <button onClick={ () => setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
            </div>
            
            <div style={{ display: 'flex' }}>
                <div>
                    <label style={{ marginRight: '1rem' }} htmlFor="show-leads">Show Leads</label>
                    <input style={{ marginRight: '3rem' }} type="checkbox" id="show-leads" value="true" defaultChecked />
                </div>
                <div>
                    <label style={{ marginRight: '1rem' }} htmlFor="show-area">Show Area Overlay</label>
                    <input style={{ marginRight: '3rem' }} type="checkbox" id="show-area" value="true" defaultChecked />
                </div>
            </div>
            <button className="button primary">Edit Area</button>
        </section>
    );
};

export default MapOptionsShow;