//------- new goal button 

const newGoalBtn = document.getElementById("newGoalBtn");
const newGoalModal = document.querySelector(".new_goal_modal");
const newGoalForm = document.querySelector(".progress_form");
const formProgress = document.querySelector('.progress_form_progress');
const stepIndicators = document.querySelectorAll(".progress_form_container li");
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const formSteps = document.querySelectorAll('.form_step');
const formStepsContainer = document.querySelector(".form_steps_container");
const activeGoals = document.getElementById("active_goals_data");
const completedGoals = document.getElementById("goals_completed_data");
const totalSaved = document.getElementById("total_savings_data");

document.documentElement.style.setProperty("--steps", stepIndicators.length);

let currentStep = 0;

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

    // current amount slider
const current = document.getElementById('goal-current');
const slider = document.getElementById('goal-slider');
const target = document.getElementById('goal-target');

function updateSlider() {
    const max = parseFloat(target.value) || 100;
    slider.max = max;
    const val = Math.min(parseFloat(current.value) || 0, max);
    current.value = val;
    slider.value = val;
    slider.style.background = `linear-gradient(90deg, var(--accent-color) ${(val/max)*100}%, var(--input-color) ${(val/max)*100}%)`;
}

target.oninput = updateSlider;
slider.oninput = () => { current.value = slider.value; updateSlider(); };
current.oninput = updateSlider;

newGoalBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    newGoalModal.classList.toggle('active');
    updateFormProgress();
    updateSlider();
});
document.addEventListener('click', function(e) {
    if (!newGoalForm.contains(e.target) && newGoalModal.classList.contains('active')) 
        newGoalModal.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') 
        newGoalModal.classList.remove('active');
});












// -------total savings hover effect 

// Hover total savings card effect 
// include lib/vanilla-tilt.min.js 
const statsCard = document.querySelector('.user_statistics > .stat_card');

VanillaTilt.init(statsCard, {
    max:3,
    glare: true,
    'max-glare': 0.2,
    scale: 1.02,
    speed:  10000, 
});

// ------- search functions
const searchContainer  = document.querySelector(".search"); 
const searchInput = document.getElementById('searchInput')

searchContainer.addEventListener('click', () => {
    if (searchContainer.classList.contains('expanded')) return;
    
    searchContainer.classList.add('pressed');
    
    setTimeout(() => {
        searchContainer.classList.remove('pressed');
        searchContainer.classList.add('expanded');
    }, 100);
});

document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) 
        searchContainer.classList.remove('expanded');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchContainer.classList.remove('expanded');
        searchInput.blur();
    }
});


// ----------- SORT BY -------------
const sortByWindow = document.querySelector('.sort_window');
const header = document.querySelector('.sort_window_head');

let open = false;

header.addEventListener('click', (e) => {
    sortByWindow.classList.add('pressed');
        
    setTimeout(() => {
        sortByWindow.classList.remove('pressed');
        if (typeof callback === 'function') 
            callback();
    }, 150); 
    
    e.stopPropagation();
    open = !open;
    sortByWindow.classList.toggle('open', open);
});

document.addEventListener('click', () => {
    if (open) { open = false; sortByWindow.classList.remove('open'); }
});

document.querySelectorAll('.opt input').forEach(r => {
    r.addEventListener('change', function() {
        setTimeout(() => { open = false; sortByWindow.classList.remove('open'); }, 200);
    });
});



