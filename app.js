const goalTitle = document.getElementById("goal-title");
const goalDescription = document.getElementById("goal-description");
const goalTarget = document.getElementById("goal-target");
const goalDeadline = document.getElementById("goal-deadline");
const goalCurrent = document.getElementById("goal-current");

class Goal {
    constructor({
        id = crypto.randomUUID(),
        title,
        description = "",
        target,
        current = 0,
        deadline = null,
        createdAt = new Date().toISOString(),
    }){
        this.id = id;
        this.title = title.trim();
        this.description = description.trim();
        this.target = Number(target);
        this.current = Number(current);
        this.deadline = deadline;
        this.createdAt = createdAt;
    }

    validate(){
        if (!this.title)
            return "Goal title is required";
        
        if (this.target <= 0) 
            return "Target amount must be greater than zero";
        

        if (this.current < 0) 
            return "Current amount cannot be negative";

        if (this.current > this.target) 
            return "Saved amount cannot exceed target";

        return null;
    }

    getProgress() {
        return Math.min(
            (this.current / this.target) * 100,
            100
        );
    }
}

class GoalStorage {
    static key = "goals";

    //static functions for class, not object ( Goalstorage.getAll )

    static getAll(){
        const data = localStorage.getItem(this.key);
        
        if(!data) return []

        return JSON.parse(data).map(goal => new Goal(goal));
    } 

    static save(goals){
        localStorage.setItem(this.key, JSON.stringify(goals));
    }

    static add(goal){
        const goals = this.getAll();

        goals.push(goal);

        this.save(goals);
    }
}


function chunk(array, size) {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }

    return result;
}
function createGoalCard(goal, index) {

    const card = document.createElement("article");

    const createdDate = new Date(goal.deadline);
    const day = createdDate.getDate();
    const month = createdDate.toLocaleString("en-US", {
        month: "short"
    });
    const year = createdDate.getFullYear();

    const value = goal.getProgress().toFixed(0);

    card.className = "stat_card";

    if (index === 0) {
        card.classList.add("active");
    }

    card.innerHTML = `
        <h3>${goal.title}</h3>

        <div class="goal_stats">
            <span class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}">
                ${value}%
            </span>
            <progress max="100" value="${value}" class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}"></progress>
            <data>
                $${goal.current} of $${goal.target}
            </data>
             ${goal.deadline ? `<p class="created_date">Due ${day} ${month} ${year}</p>` : ''}
        </div>
    `;


    return card;
}


function renderGoals() {

    const container = document.querySelector(".user_goals");

    container.innerHTML = "";


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
let goals = GoalStorage.getAll();

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



newGoalForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const goal = new Goal({
        title: goalTitle.value,
        description: goalDescription.value,
        target: goalTarget.value,
        current: goalCurrent.value,
        deadline: goalDeadline.value,
    });

    const error = goal.validate();


    if (error) {
        alert(error);
        return;
    }

    GoalStorage.add(goal);
    goals = GoalStorage.getAll();
    renderGoals();

    newGoalForm.reset();
    newGoalModal.classList.remove('active');
    currentStep = 0;
});

renderGoals();