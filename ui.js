// ------- search functions
const searchContainer  = document.querySelector(".search"); 

function expandSearch(){
    if (!searchContainer.classList.contains('expanded'))
        searchContainer.classList.add('expanded');
}

function collapseSearch() {
    if (searchContainer.classList.contains('expanded')) 
        searchContainer.classList.remove('expanded');
}
document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) 
        collapseSearch();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchContainer.classList.contains('expanded')) {
        collapseSearch();
        searchInput.blur(); 
    }
});

searchContainer.addEventListener('click', function(e) {
    if(!searchContainer.classList.contains('expanded')){
        e.stopPropagation();  // Чтобы не сработал клик на контейнере
        
        // Добавляем класс для анимации нажатия
        searchContainer.classList.add('pressed');
        
        // Убираем класс после окончания анимации
        setTimeout(() => {
            searchContainer.classList.remove('pressed');
            expandSearch();
        }, 100);  // 500ms = длительность анимации
    }
});

//------- new goal button 

const newGoalBtn = document.getElementById("newGoalBtn");
const newGoalModal = document.getElementById("newGoalModal");
const closeNewGoalModal = document.getElementById("closeNewGoalModal");


function displayNone(element){
    element.classList.remove('active');
}
function displayActive(element){
    element.classList.add('active');
}

newGoalBtn.addEventListener('click', () => displayActive(newGoalModal));
closeNewGoalModal.addEventListener('click', () => displayNone(newGoalModal));


// Hover total savings card effect 
// include lib/vanilla-tilt.min.js 
const card = document.getElementById('total_savings');

VanillaTilt.init(card, {
    max:3,
    glare: true,
    'max-glare': 0.2,
    scale: 1.02,
    speed:  10000, 
});
