// import { CSSProperties } from "react";
import { CSSProperties, Key, useEffect } from "react";
import { dateDiff, dateParse } from "../../lib/dateLib";
import type { calenderStatus } from "./ganttCalender";
import { getProjectFilter } from '../../lib/dataLib'

import type { projectType, taskType } from '../type/dataType';

type dataType = calenderStatus & { 
    projects: projectType[];
    tasks: taskType[];
    blockSize: number;
    taskMove:Function;
}

export type projectBarType = { 
    style: CSSProperties
    project: projectType; 
}; 
export type taskBarType = { 
    style: CSSProperties; 
    task: taskType; 
}; 

type barStatusType = {
    dragging : boolean;
    leftResizing : boolean;
    rightResizing : boolean;
    pageX : number;
    element : any
    left : number
    width : number
    taskId : number
    animationLeft : number
    animationWidth : number
} ;
const fps = 60 / 1000;

let barStatus:barStatusType = {
    dragging : false,
    leftResizing  : false,
    rightResizing  : false,
    pageX : 0,
    element : null,
    left : 0,
    width : 0,
    taskId : 0,
    animationLeft : 0,
    animationWidth : 0,
}

const TaskBarItems:React.FC<dataType> = ({start, blockSize, calendarWidth, calendarHeigth, projects, tasks, taskMove}) => {
    const getTaskBars = (projects:projectType[], tasks:taskType[]) => {
        let startDate = new Date(start.getTime());
        let top = 10;
        let style;
        let left = 0;
        let between = 0;
        let projectBars:any = []
        let taskBars:any = []
        projects.forEach((project) => {
            left = 0;
            between = 0;
            style = {}
            let dateFrom = null;
            let dateTo = null;
            const projectTasks = getProjectFilter(project.id, tasks);
            if (project.startDate && project.endDate) {
                dateFrom = dateParse(project.startDate, 'yyyy-MM-dd');
                dateTo = dateParse(project.endDate, 'yyyy-MM-dd');
                between = dateDiff(dateFrom, dateTo, 'day') +1;
                let start = dateDiff(startDate, dateFrom,'day');
                left = start * blockSize;
            }
            style = {
                top: `${top}px`,
                left: `${left}px`,
                width: `${blockSize * between}px`,
            }
            projectBars.push({
                style,
                project
            })
            top += 40;
            projectTasks.forEach(task => {
                style = {}
                let dateFrom = dateParse(task.startDate, 'yyyy-MM-dd');
                let dateTo = dateParse(task.endDate, 'yyyy-MM-dd');
                between = dateDiff(dateFrom, dateTo, 'day') +1;
                let start = dateDiff(startDate, dateFrom, 'day');
                left = start * blockSize;
                style = {
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${blockSize * between}px`,
                }
                top = top + 40;
                taskBars.push({
                style,
                task
                })
            })
        })
        return {projects: projectBars, tasks:taskBars}
    }

    const taskBars = getTaskBars(projects, tasks)

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {mouseMove(e)});
        window.addEventListener('mousemove', (e) => {mouseResize(e)});
        window.addEventListener('mouseup', (e) => {stopDrag(e)});
        
        return () => {
            window.removeEventListener('mousemove', (e) => {mouseMove(e)});
            window.removeEventListener('mousemove', (e) => {mouseResize(e)});
            window.removeEventListener('mouseup', (e) => {stopDrag(e)});
        }
    },[])
    
    const taskBarAnimation = (() => {
        if (!barStatus.dragging && !barStatus.leftResizing && !barStatus.rightResizing) {
            return
        }
        if (barStatus.element) {
            barStatus.element.style.left = `${barStatus.animationLeft}px`;
            barStatus.element.style.width = `${barStatus.animationWidth}px`;
        }
        setInterval(taskBarAnimation, fps)
    });
    const mouseDownMove = ((e: any, task:taskType) => {
        barStatus = {
            dragging : true,
            leftResizing : false,
            rightResizing : false,
            pageX : e.pageX,
            element : e.target,
            left : parseInt(e.currentTarget?.style.left.replace('px', '')),
            width : parseInt(e.currentTarget?.style.left.replace('px', '')),
            animationLeft : parseInt(e.currentTarget?.style.left.replace('px', '')),
            animationWidth : parseInt(e.currentTarget?.style.width.replace('px', '')),
            taskId : task.id,
        }
        taskBarAnimation();
    });
    const mouseDownResize = ((e: any, task:taskType, direction:'left'|'right') => {
        e.stopPropagation();
        barStatus = {
            dragging : false,
            leftResizing : direction === 'left'? true : false,
            rightResizing : direction === 'right'? true : false,
            pageX : e.pageX,
            element : e.target.parentElement,
            left : parseInt(e.currentTarget?.parentElement.style.left.replace('px', '')),
            width : parseInt(e.currentTarget?.parentElement.style.width.replace('px', '')),
            animationLeft : parseInt(e.currentTarget?.parentElement.style.left.replace('px', '')),
            animationWidth : parseInt(e.currentTarget?.parentElement.style.width.replace('px', '')),
            taskId : task.id,
        }
        taskBarAnimation();
    });
    const mouseMove = ((e:any) => {
        if (barStatus.dragging) {
            let diff = e.pageX - barStatus.pageX;
            barStatus.animationLeft = barStatus.left + diff;
        }
    });
    const mouseResize = ((e:any) => {
        if (barStatus.leftResizing) {
            let diff = e.pageX - barStatus.pageX;
            barStatus.animationLeft = barStatus.left + diff;
            barStatus.animationWidth = barStatus.width - diff;
        }
        if (barStatus.rightResizing) {
            let diff = e.pageX - barStatus.pageX;
            barStatus.animationWidth = barStatus.width + diff;
        }
    });
    const stopDrag = ((e:any) => {
        if (barStatus.dragging) {
            let diff = e.pageX - barStatus.pageX;
            let days = Math.round(diff / blockSize);
            if (days !== 0) {
                taskMove(barStatus.taskId, days, days);
            } else {
                barStatus.animationLeft = barStatus.left;
                taskBarAnimation();
            }
        }
        if (barStatus.leftResizing) {
            let diff = e.pageX - barStatus.pageX;
            let days = Math.round(diff / blockSize);
            if (days !== 0) {
                taskMove(barStatus.taskId, days, 0);
            } else {
                barStatus.animationLeft = barStatus.left;
                barStatus.animationWidth = barStatus.width;
                taskBarAnimation();
            }
        }
        if (barStatus.rightResizing) {
            let diff = e.pageX - barStatus.pageX;
            let days = Math.round(diff / blockSize);
            if (days !== 0) {
                taskMove(barStatus.taskId, 0, days);
            } else {
                barStatus.animationWidth = barStatus.width;
                taskBarAnimation();
            }
        }

        barStatus.dragging = false
        barStatus.leftResizing = false
        barStatus.rightResizing = false
    });
    
    return (
        <div id="gantt-bar-area" className="relative" style={{width:`${calendarWidth}px`,height:`${calendarHeigth}px`}}>
            {taskBars.projects.map((project: projectBarType, index: Key) => {
                return (
                    <div key={index}>
                        <div style={project.style} className="rounded-lg absolute h-5 bg-lime-100" v-if="bar.list.cat === 'task'">
                            <div className="w-full h-full">
                            </div>
                        </div>
                        {taskBars.tasks.filter((task: taskBarType) => task.task.projectId === project.project.id).map((task:taskBarType, taskIndex:number) => {
                            return (
                                <div key={taskIndex} style={task.style} className="rounded-lg absolute h-5 bg-yellow-100" onMouseDown={(e) => {mouseDownMove(e, task.task)}}>
                                    <div className="w-full h-full pointer-events-none">
                                        <div className={`h-full bg-yellow-500 rounded-l-lg pointer-events-none ${task.task.progress === 100?'rounded-r-lg':''}`}
                                            style={{width:`${task.task.progress}%`}}>
                                        </div>
                                    </div>
                                    <div className="absolute w-2 h-full" style={{top:'0px',left:'0px',cursor:'col-resize'}} onMouseDown={(e) => {mouseDownResize(e, task.task, 'left')}}>
                                    </div>
                                    <div className="absolute w-2 h-full" style={{top:'0px',right:'0px',cursor:'col-resize'}} onMouseDown={(e) => {mouseDownResize(e, task.task, 'right')}}>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default TaskBarItems;