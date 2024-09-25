export default class WorkExperience {
    constructor(id, workTitle, role, producer, projectUrl, startDate, endDate, description) {
        this.id = id;
        this.work_title = workTitle;
        this.role = role;
        this.producer = producer;
        this.start_date = startDate;
        this.end_date = endDate;
        this.project_url = projectUrl;
        this.description = description;
    }
  }