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

    const stats = getMonthlyDeposits(
        GoalStorage.getAll()
    );

    const max = Math.max(
        ...stats.map(item => item.deposits)
    );


    const containers = document.querySelectorAll(
        ".monthly_spendings"
    );


    containers.forEach((container, index)=>{

        const data = stats[index];

        const height = max
            ? (data.deposits / max) * 100
            : 0;


        container.querySelector("span")
            .textContent = data.month;


        container.querySelector("data")
            .textContent = `$${data.deposits.toFixed(1)}`;


        container.querySelector(".monthly_spendings_progress_bar")
            .style.height = `${height}%`;

    });
} 

export function getMonthlyDeposits(goals){

    const months = [];

    const now = new Date();

    for(let i = 0; i < 12; i++){

        const date = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        );

        months.push({
            month: date.toLocaleString(
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

            const index = months.findIndex(month =>
                month.month === depositDate.toLocaleString(
                    "en-US",
                    { month:"short" }
                )
                &&
                month.year === depositDate.getFullYear()
            );


            if(index !== -1){
                months[index].deposits += deposit.amount;
            }

        });

    });


    return months;
}