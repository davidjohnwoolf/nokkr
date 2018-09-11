export const sortItems = (originalList, sortSettings) => {
    if (sortSettings.column) {
        const sortedList = [...originalList];
        
        sortedList.sort((a, b) => {
            return sortSettings.ascending
                ? (a[sortSettings.column] > b[sortSettings.column] ? 1 : -1)
                : (a[sortSettings.column] < b[sortSettings.column]  ? 1 : -1);
        });
        
        return sortedList;
        
    } else { return originalList; }
}

//this is specific to leads
export const searchItems = (items, query) => {
    const formattedQuery = query.toLowerCase().replace(/[^\w]/gi, '');
    
    let results = items.filter(item => {
        let match = false;
        
        //make this specific to leads somehow
        let fullName = (item.firstName + ' ' + item.lastName).toLowerCase().replace(/[^\w]/gi, '');

        if (fullName.includes(formattedQuery)) match = true;
        
        for (let prop in item) {
            if (prop === 'customFields') {
                let customFields = item[prop][0];
                
                for (let key in customFields) {
                    if (typeof customFields[key] === 'string'
                        && customFields[key].toLowerCase().replace(/[^\w]/gi, '').includes(formattedQuery))
                    {
                        match = true;
                    }
                }
            }
            
            //use whitelist here and on lead show etc, not black list
            if (typeof item[prop] === 'string'
                && item[prop].toLowerCase().replace(/[^\w]/gi, '').includes(formattedQuery)
                && (prop !== 'leadStatusId') && (prop !== '_id')
                && (prop !== 'areaId') && (prop !== 'lat') && (prop !== 'lng')
                && (prop !== 'lng') && (prop !== 'createdBy'))
            {
                match = true;
            }
        }
        
        return match;
    });
    
    return results;
}