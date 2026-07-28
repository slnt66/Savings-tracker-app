import GoalStorage from "../models/goalStorage.js";
import {renderGoals} from "./goalRender.js"

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

searchInput.addEventListener("input", () => {

    const filteredGoals = searchGoals(searchInput.value);

    renderGoals(filteredGoals);

});

function searchGoals(query) {
    const goals = GoalStorage.getAll();

    const normalizedQuery = query
        .trim()
        .toLowerCase();

    if (!normalizedQuery) {
        return goals;
    }

    return goals.filter(goal =>
        goal.title
            .toLowerCase()
            .includes(normalizedQuery)
    );
}