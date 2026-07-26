const sortByWindow = document.querySelector('.sort_window');
const header = document.querySelector('.sort_window_head');

let open = false;

header.addEventListener('click', (e) => {
    sortByWindow.classList.add('pressed');
        
    setTimeout(() => {
        sortByWindow.classList.remove('pressed');
        if (typeof callback === 'function') 
            callback();
    }, 150); 
    
    e.stopPropagation();
    open = !open;
    sortByWindow.classList.toggle('open', open);
});

document.addEventListener('click', () => {
    if (open) { open = false; sortByWindow.classList.remove('open'); }
});

document.querySelectorAll('.opt input').forEach(r => {
    r.addEventListener('change', function() {
        setTimeout(() => { open = false; sortByWindow.classList.remove('open'); }, 200);
    });
});
