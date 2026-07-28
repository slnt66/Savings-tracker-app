import Goal from "./goal.js";
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
    static getGoal(id){
        const goals = this.getAll();

        return goals.find(goal => goal.id === id) ?? null;
    }
    static getSize(){
        const goals = this.getAll();

        return goals.length;
    }
    static getCompleted(){
        const goals = this.getAll();

        return goals.filter(
            goal => goal.getProgress() === 100
        ).length;
    }
    static getSavingsSum(){
        const goals = this.getAll();

        return goals.reduce(
            (sum, goal) => sum + goal.current,
            0
        );
    }
}

export default GoalStorage;