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