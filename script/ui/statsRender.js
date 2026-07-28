import GoalStorage from "../models/goalStorage.js";

const activeGoals = document.getElementById("active_goals_data");
const completedGoals = document.getElementById("goals_completed_data");
const totalSaved = document.getElementById("total_savings_data");

export function updateStats(){
    activeGoals.textContent = GoalStorage.getSize();

    completedGoals.textContent =  GoalStorage.getCompleted();

    const total = GoalStorage.getSavingsSum();

    totalSaved.textContent = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(total);
} 