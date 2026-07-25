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
    static remove(id){

        const goals = this.getAll()
            .filter(goal => goal.id !== id);

        this.save(goals);
    }
    static update(updatedGoal){

        const goals = this.getAll();

        const index = goals.findIndex(
            goal => goal.id === updatedGoal.id
        );

        if(index === -1) return;

        goals[index] = updatedGoal;

        this.save(goals);
    }
}

let goals = GoalStorage.getAll();
let activeModal = null;

function updateStats(){
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
    
    

    if (index === 0) {
        card.classList.add("active");
    }

    card.innerHTML = `
        <h3>${goal.title}</h3>
        
        <div class="goal_stats">
            ${value == 100 ? `<div class="completed_bar">complete</div>` : ''}
            <span class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}">
                ${value}%
            </span>
            <progress max="100" value="${value}" class="${value == 100 ? `completed` : ``} ${value == 0 ? `not_started` : ``}"></progress>
            <data>
                $${goal.current} of $${goal.target}
            </data>
             ${goal.deadline ? `<p class="created_date">Due ${day} ${month} ${year}</p>` : ''}
        </div>
        <div class="controls">
            <button type="submit" class="btn_secondary inactive" id="submitDeleteGoal">Submit</button>
            <button type="button" class="btn_secondary" id="addFundsBtn">Add $</button>
            <button type="button" class="btn_secondary" id="editGoalBtn">Edit</button>
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

function addFunds(goal, card){
    const current = card.querySelector('#goal-update-current');
    const slider = card.querySelector('#goal-update-slider');

    function updateSlider() {
        const max = goal.target - goal.current;
        slider.max = max;
        const val = Math.min(parseFloat(current.value) || 0, max);
        current.value = val;
        slider.value = val;
        slider.style.background = `linear-gradient(90deg, var(--accent-color) ${(val/max)*100}%, var(--input-color) ${(val/max)*100}%)`;
    }

    slider.oninput = () => { current.value = slider.value; updateSlider(); };
    current.oninput = updateSlider;

    const submit = card.querySelector("#submitFundsUpdate");
    submit.addEventListener("click", () => {
        const amount = parseFloat(current.value);
        goal.current += amount;

        if(!amount || amount <= 0) return;
        
        if(goal.current > goal.target)
            goal.current = goal.target;

        GoalStorage.update(goal);
        goals = GoalStorage.getAll();

        closeGoalModal();
        renderGoals();
        updateStats();
    })
}
function deleteGoal(goal){

    GoalStorage.remove(goal.id);


    closeGoalModal();

    goals = GoalStorage.getAll();
    renderGoals();
    updateStats();
}


function closeGoalModal(){
    const { card, clone, rect, goalModalControls } = activeModal;

    modalBackdrop.style.opacity = 0;
    modalBackdrop.style.pointerEvents = "none";

    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.transform = "translate(0, 0)";
    
    goalModalControls.style.pointerEvents = "none";
    goalModalControls.style.opacity = "0";
    
    clone.addEventListener("transitionend", (e) => {
        document.body.style.overflow = "";
        card.style.opacity = "1";

        clone.remove();
    }, { once: true });
}


function openGoalModal(e){
    const card = e.target.closest(".stat_card");

    if(!card) return;

    const id = card.dataset.id;

    const goal = goals.find(
        goal => goal.id === id
    );
    
    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    
    const goalModalControls = clone.querySelector(".controls");
    

    activeModal = {
        card,
        clone,
        rect,
        goalModalControls
    };

    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.opacity = "1";
    clone.style.transition = "all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)";

    document.body.append(clone);

    const finalWidth = window.innerWidth <= 720 ? 300 : 600;
    const finalHeight = window.innerWidth <= 720 ? 300 : 600;

    const centerX = window.innerWidth / 2 - finalWidth / 2;
    const centerY = window.innerHeight / 2 - finalHeight / 2;

    dx = centerX - rect.left;
    dy = centerY - rect.top;

    requestAnimationFrame(() => {
        document.body.style.overflow = "hidden";
        card.style.opacity = "0";
        clone.style.transform =
            `translate(${dx}px, ${dy}px)`;
        clone.style.width = finalWidth + "px";;
        clone.style.height = finalHeight + "px";

        modalBackdrop.style.opacity = 1;
        modalBackdrop.style.pointerEvents ="auto";

        goalModalControls.style.pointerEvents = "auto";
        goalModalControls.style.opacity = "1";

        const addFundsBtn = clone.querySelector("#addFundsBtn");
        const deleteGoalBtn = clone.querySelector("#deleteGoalBtn");
        const editGoalBtn = clone.querySelector("#editGoalBtn");

        const submitFundsUpdateBtn = clone.querySelector("#submitFundsUpdate");
        const submitDeleteGoalBtn = clone.querySelector("#submitDeleteGoal");
        const cloneCompleteGoalBtn = clone.querySelector(".completed_bar");

        const addFundsControls = clone.querySelector(".add_funds");

        addFundsBtn.addEventListener("click",() => {
            addFunds(goal, clone); 
            addFundsControls.classList.toggle("active");
            deleteGoalBtn.classList.toggle("inactive");
            editGoalBtn.classList.toggle("inactive");
            submitFundsUpdateBtn.classList.toggle("inactive");
        });

        deleteGoalBtn.addEventListener("click", () => {
            addFundsBtn.classList.toggle("inactive");
            editGoalBtn.classList.toggle("inactive");
            submitDeleteGoalBtn.classList.toggle("inactive");

            submitDeleteGoalBtn.addEventListener("click", () => deleteGoal(goal))
        });

        cloneCompleteGoalBtn.addEventListener("click", () => {
            const confirmDelete = confirm(
                `Delete "${goal.title}"?`
            );
            if(!confirmDelete) return;

            deleteGoal(goal)
    });
    });

}

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

    updateStats();

    renderGoals();

    newGoalForm.reset();
    newGoalModal.classList.remove('active');
    currentStep = 0;
});

updateStats();

goalsContainer.addEventListener("click", openGoalModal);
modalBackdrop.addEventListener("click", closeGoalModal);
renderGoals();