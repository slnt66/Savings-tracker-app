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

export default Goal;