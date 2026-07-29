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

    renderMonthlyDeposits(
        GoalStorage.getAll()
    );

} 

function getVisibleMonthsCount(){
    if(window.innerWidth < 576)
        return 4;

    if(window.innerWidth < 992)
        return 6;

    return 12;
}

export function collectMonthlyDeposits(goals){

    const months = [];

    const now = new Date();

    for(let i = 0; i < 12; i++){

        const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        );

        months.push({
            label: date.toLocaleString(
                "en-US",
                { month: "short" }
            ),
            year: date.getFullYear(),
            deposits: 0
        });
    }


    goals.forEach(goal => {

        goal.deposits.forEach(deposit => {

            const depositDate = new Date(deposit.date);

            const month = months.find(month =>
                month.label === depositDate.toLocaleString(
                    "en-US",
                    { month:"short" }
                )
                &&
                month.year === depositDate.getFullYear()
            );


            if(month){
                month.deposits += deposit.amount;
            }

        });

    });

    return months;
}

export function renderMonthlyDeposits(goals){

    const container = document.querySelector(".yearly_stats");

    const monthsCount = getVisibleMonthsCount();

    const months = collectMonthlyDeposits(goals)
        .slice(0, monthsCount);


    container.style.setProperty(
        "--months-count",
        months.length
    );


    container.innerHTML = "";


    const maxDeposit = Math.max(
        ...months.map(month => month.deposits),
        1
    );


    months.forEach(month => {

        const card = document.createElement("div");

        card.className = "monthly_spendings";

        const height = 
            (month.deposits / maxDeposit) * 100;


        card.innerHTML = `
            <div class="progress_container">
                <div class="monthly_spendings_progress_bar"
                     style="height:${height}%">
                </div>
            </div>

            <data value="${month.deposits.toFixed(1)}">
                $${month.deposits.toFixed(1)}
            </data>

            <span>
                ${month.label}
            </span>
        `;


        container.append(card);
    });
}