import GoalStorage from "./models/goalStorage.js";
import { updateStats } from "./ui/statsRender.js";
import { renderGoals } from "./ui/goalRender.js";

import "./ui/effects.js";
import "./ui/goalModal.js";
import "./ui/newGoalModal.js";
import "./ui/search.js";
import "./ui/search.js";
import "./ui/sortBy.js";

refreshUI();

export function refreshUI() 
{
    updateStats();
    renderGoals();
}
