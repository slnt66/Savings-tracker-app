
import Goal from "../models/goal.js";
import GoalStorage from "../models/goalStorage.js";
import { refreshUI } from "../app.js";


const newGoalBtn = document.getElementById("newGoalBtn");
const newGoalModal = document.querySelector(".new_goal_modal");
const newGoalForm = document.querySelector(".progress_form");
const formProgress = document.querySelector('.progress_form_progress');
const stepIndicators = document.querySelectorAll(".progress_form_container li");

const formSteps = document.querySelectorAll('.form_step');
const formStepsContainer = document.querySelector(".form_steps_container");

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');

const target = document.getElementById('goal-target');
const slider = document.getElementById('goal-slider');
const current = document.getElementById('goal-current');

const goalTitle = document.getElementById("goal-title");
const goalDescription = document.getElementById("goal-description");
const goalTarget = document.getElementById("goal-target");
const goalDeadline = document.getElementById("goal-deadline");
const goalCurrent = document.getElementById("goal-current");

document.documentElement.style.setProperty("--steps", stepIndicators.length);

let currentStep = 0;

export function updateSlider(slider, current, max) {
    slider.max = max;
    const val = Math.min(parseFloat(current.value) || 0, max);
    current.value = val;
    slider.value = val;
    slider.style.background = `linear-gradient(90deg, var(--accent-color) ${(val/max)*100}%, var(--input-color) ${(val/max)*100}%)`;
}

const isValidStep = () => {
    const fields = formSteps[currentStep].querySelectorAll('#goal-title, #goal-target');
    return [...fields].every((field)=> field.reportValidity());
}

const updateFormButtons = () => {
    prevBtn.hidden = currentStep == 0;
    nextBtn.hidden = currentStep >= stepIndicators.length - 1;
    submitBtn.hidden = !nextBtn.hidden;
}

const updateFormProgress = () =>{
    let formProgressWidth = currentStep / (stepIndicators.length - 1);
    formProgress.style.transform = `scaleX(${formProgressWidth})`;

    formStepsContainer.style.height = formSteps[currentStep].offsetHeight + "px";
    stepIndicators.forEach((indicator, index) =>{
        indicator.classList.toggle("current", currentStep === index);
        indicator.classList.toggle("done", currentStep > index);
    })

    formSteps.forEach((step, index) =>{
        step.style.transform = `translateX(-${currentStep * 100}%`;
        step.classList.toggle("current", currentStep === index);
        //for correct tab navigation
        step.toggleAttribute('inert', index !== currentStep); 
    })

    updateFormButtons();
}

prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if(currentStep>0){
        currentStep--;
        updateFormProgress();
    }
})

nextBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if(!isValidStep()) return;
    if(currentStep < stepIndicators.length - 1){
        currentStep++;
        updateFormProgress();
    }
})

target.addEventListener("input", () => {
    updateSlider(slider, current, parseFloat(target.value) || 100);
});

slider.addEventListener("input", () => {
    current.value = slider.value;
    updateSlider(slider, current, parseFloat(target.value) || 100);
});

current.addEventListener("input", () => {
    updateSlider(slider, current, parseFloat(target.value) || 100);
});

newGoalBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    newGoalModal.classList.toggle('active');
    updateFormProgress();
});
document.addEventListener('click', function(e) {
    if (!newGoalForm.contains(e.target) && newGoalModal.classList.contains('active')) 
        newGoalModal.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') 
        newGoalModal.classList.remove('active');
});


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

    refreshUI();

    newGoalForm.reset();
    newGoalModal.classList.remove('active');
    currentStep = 0;
});