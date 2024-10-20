import { projectType, taskType } from "../ganttChart/type/dataType";

const setProjectDate = (projects:projectType[], tasks:taskType[]):projectType[] => {
    let resultProjects = {...projects}
    resultProjects = projects.map((project) => {
        const projectTasks = getProjectFilter(project.id, tasks);
        if (projectTasks.length > 0) {
            const dateFrom = projectTasks.reduce((prev, current) => {
                if (prev.startDate < current.startDate) {
                    return prev;
                } else {
                    return current;
                }
            }).startDate;
            const dateTo = projectTasks.reduce((prev, current) => {
                if (prev.endDate > current.endDate) {
                    return prev;
                } else {
                    return current;
                }
            }).endDate;
            project.startDate = dateFrom;
            project.endDate = dateTo;
        }
        return project;
    })
    return resultProjects;
}

const getProjectFilter = (projectId:number, tasks:taskType[]):taskType[] => {
    return tasks.filter(task => task.projectId === projectId)
}

export {setProjectDate, getProjectFilter}