import { goals, refreshGoals } from "../app.js";
import { updateStats } from "./statsRender.js";
import { renderGoals } from "./goalRender.js";
import GoalStorage from "../models/goalStorage.js";

let activeModal = null;

const goalsContainer = document.querySelector(".user_goals");
const modalBackdrop = document.querySelector(".modal_backdrop");

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
        refreshGoals();

        closeGoalModal();
        renderGoals();
        updateStats();
    })
}
function deleteGoal(goal){

    GoalStorage.remove(goal.id);

    closeGoalModal();

    refreshGoals();
    renderGoals();
    updateStats();
}


export function closeGoalModal(){
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


export function openGoalModal(e){
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

    let dx = centerX - rect.left;
    let dy = centerY - rect.top;

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

        const submitFundsUpdateBtn = clone.querySelector("#submitFundsUpdate");
        const submitDeleteGoalBtn = clone.querySelector("#submitDeleteGoal");
        const cloneCompleteGoalBtn = clone.querySelector(".completed_bar");

        const addFundsControls = clone.querySelector(".add_funds");

        addFundsBtn.addEventListener("click",() => {
            addFunds(goal, clone); 
            addFundsControls.classList.toggle("active");
            deleteGoalBtn.classList.toggle("inactive");
            submitFundsUpdateBtn.classList.toggle("inactive");
        });

        deleteGoalBtn.addEventListener("click", () => {
            addFundsBtn.classList.toggle("inactive");
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

goalsContainer.addEventListener("click", openGoalModal);
modalBackdrop.addEventListener("click", closeGoalModal);