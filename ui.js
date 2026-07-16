// ------- search functions
const searchContainer  = document.querySelector(".search"); 
const searchInput = document.getElementById('searchInput')

function expandSearch(){
    if (!searchContainer.classList.contains('expanded')){
        searchContainer.classList.add('expanded');
    }
}

function collapseSearch() {
    if (searchContainer.classList.contains('expanded')) {
        searchContainer.classList.remove('expanded');
       
    }
        
}
document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) 
        collapseSearch();
        
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchContainer.classList.contains('expanded')) {
        collapseSearch();
        // searchInput.blur(); 
    }
});

function pressedEffect(element, callback, delay = 100){
    if(!element.classList.contains('expanded')){
        element.classList.add('pressed');
        
        setTimeout(() => {
            element.classList.remove('pressed');
            if (typeof callback === 'function') 
                callback();
        }, delay); 
    }
}
// ----------- SORT BY -------------
const glass = document.querySelector('.sort_window');
const header = document.querySelector('.sort_window_head');
let open = false;

header.addEventListener('click', (e) => {
    glass.classList.add('pressed');
        
    setTimeout(() => {
        glass.classList.remove('pressed');
        if (typeof callback === 'function') 
            callback();
    }, 150); 
    
    e.stopPropagation();
    open = !open;
    glass.classList.toggle('open', open);
});

document.addEventListener('click', () => {
    if (open) { open = false; glass.classList.remove('open'); }
});

document.querySelectorAll('.opt input').forEach(r => {
    r.addEventListener('change', function() {
        console.log(this.value);
        setTimeout(() => { open = false; glass.classList.remove('open'); }, 200);
    });
});



searchContainer.addEventListener('click',() => pressedEffect(searchContainer, expandSearch));

// const sortByBtn = document.getElementById('sortByBtn');
// sortByBtn.addEventListener('click', () => pressedEffect(sortByBtn));

//------- new goal button 

const newGoalBtn = document.getElementById("newGoalBtn");
const newGoalModal = document.getElementById("newGoalModal");
const closeNewGoalModal = document.getElementById("closeNewGoalModal");
const modalContent = document.querySelector(".modal_content")

function displayNone(element){
    element.classList.remove('active');
}
function displayActive(element){
    element.classList.add('active');
}
document.addEventListener('click', function(e) {
    if (!modalContent.contains(e.target)) 
        displayNone(newGoalModal);
        
});
newGoalBtn.addEventListener('click', () => {
    pressedEffect(newGoalBtn, () => displayActive(newGoalModal));
});
closeNewGoalModal.addEventListener('click', () => displayNone(newGoalModal));

// -------total savings hover effect 

// Hover total savings card effect 
// include lib/vanilla-tilt.min.js 
const statsCard = document.querySelector('.user_statistics > .stat_card');

VanillaTilt.init(statsCard, {
    max:3,
    glare: true,
    'max-glare': 0.2,
    scale: 1.02,
    speed:  10000, 
});
