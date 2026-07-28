import GoalStorage from "../models/goalStorage.js";

function chunk(array, size) {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
}

function createGoalCard(goal, index) {

    const card = document.createElement("article");
    card.className = "stat_card";
    card.dataset.id = goal.id;
    const createdDate = new Date(goal.deadline);
    const day = createdDate.getDate();
    const month = createdDate.toLocaleString("en-US", {
        month: "short"
    });
    const year = createdDate.getFullYear();

    const value = goal.getProgress().toFixed(0);
    
    if (index === 0) card.classList.add("active");
    

    card.innerHTML = `
        <h3>${goal.title}</h3>
        
        <div class="goal_stats">
            ${value == 100 ? `<div class="completed_bar">complete</div>` : ''}
            <span class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}">
                ${value}%
            </span>
            <progress max="100" value="${value}" class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}"></progress>
            <data>
                $${goal.current.toFixed(1)} of $${goal.target.toFixed(1)}
            </data>
             ${goal.deadline ? `<p class="created_date">Due ${day} ${month} ${year}</p>` : ''}
        </div>
        <div class="controls">
            <button type="submit" class="btn_secondary inactive" id="submitDeleteGoal">Submit</button>
            <button type="button" class="btn_secondary" id="addFundsBtn">Add $</button>
            <button type="button" class="btn_secondary" id="deleteGoalBtn">Delete</button>
            <button type="submit" class="btn_secondary inactive" id="submitFundsUpdate">Submit</button>
        </div>
        <div class="add_funds">
            <input type="range" id="goal-update-slider" min="0" max="${goal.target-goal.current}" step="0.1" value="0">
            <input type="number" id="goal-update-current" min="0" step="0.1" 
                                    placeholder="0.00" value="0">
        </div>
    `;

    return card;
}

export function renderGoals(goals = GoalStorage.getAll()) {

    const container = document.querySelector(".user_goals");

    container.innerHTML = "";
    if(goals.length ===0){
        container.innerHTML = `
            <div class="empty_state">
                <img src="../../static/images/not-found.svg">
                No goals found
            </div>
        `;
        return;
    }
    
    const groups = chunk(goals, 4);

    groups.forEach((group, index) => {

        const grid = document.createElement("div");


        grid.classList.add(
            "goal_group",
            index % 2 === 0
                ? "normal"
                : "mirrored"
        );


        group.forEach((goal, index) => {
            grid.append(
                createGoalCard(goal, index)
            );
        });

        container.append(grid);

    });

}