import GoalStorage from "../models/goalStorage.js";
import {renderGoals} from "./goalRender.js"

const searchContainer  = document.querySelector(".search"); 
const searchInput = document.getElementById('searchInput')

searchContainer.addEventListener('click', () => {
    if (searchContainer.classList.contains('expanded')) return;
    
    searchContainer.classList.add('pressed');

    searchContainer.classList.add('expanded');
    
});
searchContainer.addEventListener('transitionend', () => {
    searchContainer.classList.remove('pressed');
});

searchContainer.addEventListener("focusin", () => {
    searchContainer.classList.add("expanded");
});

searchContainer.addEventListener("focusout", () => {
    searchContainer.classList.remove("expanded");
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