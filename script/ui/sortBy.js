import GoalStorage from "../models/goalStorage.js";
import {renderGoals} from "./goalRender.js"
const sortByWindow = document.querySelector('.sort_window');
const header = document.querySelector('.sort_window_head');


header.addEventListener('click', (e) => {
    sortByWindow.classList.add('pressed');
        
    setTimeout(() => {
        sortByWindow.classList.remove('pressed');
    }, 150); 
    
    e.stopPropagation();

    sortByWindow.classList.toggle('open');
});

document.addEventListener('click', () => {
    sortByWindow.classList.remove('open'); 
});

document.querySelectorAll('.opt input').forEach(input => {
    input.addEventListener('change', (e) => {
        const sortedGoals = sortGoals(e.target.value);

        renderGoals(sortedGoals);

        setTimeout(() => { sortByWindow.classList.remove('open'); }, 200);
    });
});

function sortGoals(by){
    const goals = GoalStorage.getAll();
    switch(by){

        case "name-asc":
            return goals
                .sort((a, b) => 
                    a.title.localeCompare(b.title)
                );

        case "name-desc":
            return goals
                .sort((a, b) => 
                    b.title.localeCompare(a.title)
                );

        case "new":
            return goals
                .sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

        case "old":
            return goals
                .sort((a, b) =>
                    new Date(a.createdAt) - new Date(b.createdAt)
                );

        default:
            return goals;
    }
}