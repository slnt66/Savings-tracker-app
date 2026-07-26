const searchContainer  = document.querySelector(".search"); 
const searchInput = document.getElementById('searchInput')

searchContainer.addEventListener('click', () => {
    if (searchContainer.classList.contains('expanded')) return;
    
    searchContainer.classList.add('pressed');
    
    setTimeout(() => {
        searchContainer.classList.remove('pressed');
        searchContainer.classList.add('expanded');
    }, 100);
});

document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) 
        searchContainer.classList.remove('expanded');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchContainer.classList.remove('expanded');
        searchInput.blur();
    }
});