class Challenge {
  constructor(type, date, completionCondition) {
    this.type = type;
    this.date = date;
    this.completionCondition = completionCondition;
    this.progress = 0;
    this.completed = false;
  }

  updateProgress(value) {
    this.progress = value;
    this.completed = this.completionCondition(value);
  }
}

module.exports = Challenge;
