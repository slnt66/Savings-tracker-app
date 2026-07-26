import Goal from "./models/goal.js";
import GoalStorage from "./models/goalStorage.js";
import { updateStats } from "./ui/statsRender.js";
import { renderGoals } from "./ui/goalRender.js";

import "./ui/effects.js";
import "./ui/goalModal.js";
import "./ui/newGoalModal.js";
import "./ui/search.js";
import "./ui/search.js";
import "./ui/sortBy.js";

export let goals = GoalStorage.getAll();

init();

function init() {
    updateStats();
    renderGoals();
}
export function refreshGoals(){
    goals = GoalStorage.getAll();
}