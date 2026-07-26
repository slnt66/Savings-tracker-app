import { goals } from "../app.js";

const activeGoals = document.getElementById("active_goals_data");
const completedGoals = document.getElementById("goals_completed_data");
const totalSaved = document.getElementById("total_savings_data");

export function updateStats(){
    activeGoals.textContent = goals.length;
    completedGoals.textContent = goals.filter(goal => goal.getProgress() === 100).length;
    const total = goals.reduce(
        (sum, goal) => sum + goal.current,
        0
    );
    totalSaved.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(total);
} 