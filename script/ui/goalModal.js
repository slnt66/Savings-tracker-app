import { refreshUI } from "../app.js";
import GoalStorage from "../models/goalStorage.js";
import { updateSlider } from "./newGoalModal.js";

const goalsContainer = document.querySelector(".user_goals");
const modalBackdrop = document.querySelector(".modal_backdrop");

function linkInputs(maxAmount, current, slider){
    
    slider.addEventListener("input", () => {
        current.value = slider.value;
        updateSlider(slider, current, maxAmount);
    });

    current.addEventListener("input", () => {
        updateSlider(slider, current, maxAmount);
    });
}

export function closeGoalModal(card, clone, rect, goalModalControls){

    hideAbsoluteCenterModal(card, clone, rect, goalModalControls);

    clone.addEventListener("transitionend", (e) => {
        document.body.style.overflow = "";
        card.style.opacity = "1";

        clone.remove();
    }, { once: true });
}

export function hideAbsoluteCenterModal(card, clone, rect, goalModalControls){
    modalBackdrop.style.opacity = 0;
    modalBackdrop.style.pointerEvents = "none";

    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.transform = "translate(0, 0)";
    
    goalModalControls.style.pointerEvents = "none";
    goalModalControls.style.opacity = "0";

}

export function showAbsoluteCenterModal(card, clone, rect, goalModalControls){

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

    });
}

export function openGoalModal(e){
    const card = e.target.closest(".stat_card");

    if(!card) return;

    const id = card.dataset.id;

    const goal = GoalStorage.getGoal(id);

    const rect = card.getBoundingClientRect();
    const clone = card.cloneNode(true);
    const goalModalControls = clone.querySelector(".controls");
    
    showAbsoluteCenterModal(card, clone, rect, goalModalControls);

    modalBackdrop.addEventListener("click", ()=> {
        closeGoalModal(card, clone, rect, goalModalControls)},
        {once: true }
    );

    const addFundsBtn          = clone.querySelector("#addFundsBtn");
    const deleteGoalBtn        = clone.querySelector("#deleteGoalBtn");

    const submitFundsUpdateBtn = clone.querySelector("#submitFundsUpdate");
    const submitDeleteGoalBtn  = clone.querySelector("#submitDeleteGoal");
    const cloneCompleteGoalBtn = clone.querySelector(".completed_bar");

    const addFundsControls     = clone.querySelector(".add_funds");
    const current = clone.querySelector('#goal-update-current');
    const slider = clone.querySelector('#goal-update-slider');

    addFundsBtn.addEventListener("click",() => {
        let maxAmount = goal.target - goal.current;
        linkInputs(maxAmount, current, slider);

        addFundsControls.classList.toggle("active");
        deleteGoalBtn.classList.toggle("inactive");
        submitFundsUpdateBtn.classList.toggle("inactive");

    });

    submitFundsUpdateBtn.addEventListener("click", () => {
        const amount = parseFloat(current.value);

        if(!amount || amount <= 0) return;
        
        goal.current += amount;

        goal.deposits.push({
            amount,
            date: new Date().toISOString()
        });

        if(goal.current > goal.target)
            goal.current = goal.target;

        GoalStorage.update(goal);

        closeGoalModal(card, clone, rect, goalModalControls);
        refreshUI(); 
    });

    deleteGoalBtn.addEventListener("click", () => {
        addFundsBtn.classList.toggle("inactive");
        submitDeleteGoalBtn.classList.toggle("inactive");

        submitDeleteGoalBtn.addEventListener("click", () => {
            GoalStorage.remove(goal.id);
            closeGoalModal(card, clone, rect, goalModalControls);
            refreshUI();
        }, { once:true })
    });

    cloneCompleteGoalBtn.addEventListener("click", () => {
        const confirmDelete = confirm(
            `Complete and delete "${goal.title}"?`
        );
        if(!confirmDelete) return;

        GoalStorage.remove(goal.id);
        closeGoalModal(card, clone, rect, goalModalControls);
        refreshUI();
    });
}

goalsContainer.addEventListener("click", openGoalModal);