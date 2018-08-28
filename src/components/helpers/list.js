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

export const searchItems = (items, query) => {
    query = query.toLowerCase();
    
    let results = items.filter(item => {
        let found = false;
        
        for (let prop in item) {
            if (typeof item[prop] === 'string' && item[prop].toLowerCase().includes(query)) found = true;
        }
        
        return found;
    });
    
    return results;
}