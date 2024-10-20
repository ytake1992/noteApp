import { CSSProperties, MouseEvent } from "react";
import { useEffect } from "react";

import type { projectType, taskType } from '../type/dataType';

export type dataType = { 
    projects: { 
        style: CSSProperties
        project: projectType; 
    }[]; 
    tasks: {
        style: { left: string; width: string; }; 
        task: taskType; 
    }[]; 
    calendarWidth : number
    calendarHeigth : number
    blockSize: number
    taskMove:Function
}

type barStatusType = {
    dragging : boolean;
    pageX : number;
    element : any
    left : number
    taskId : number
    animationLeft : number
} 
const fps = 30 / 1000;

let barStatus:barStatusType = {
    dragging : false,
    pageX : 0,
    element : null,
    left : 0,
    taskId : 0,
    animationLeft : 0,
}

const TaskBarItems:React.FC<dataType> = ({projects, tasks, calendarWidth, calendarHeigth, blockSize, taskMove}) => {

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {mouseMove(e)});
        window.addEventListener('mouseup', (e) => {stopDrag(e)});
        
        return () => {
            window.removeEventListener('mousemove', (e) => {mouseMove(e)});
            window.removeEventListener('mouseup', (e) => {stopDrag(e)});
        }
    },[])
    
    const taskBarAnimation = (() => {
        if (!barStatus.dragging) {
            return
        }
        if (barStatus.element) {
            barStatus.element.style.left = `${barStatus.animationLeft}px`;
        }
        setInterval(taskBarAnimation, fps)
    });
    const mouseDownMove = ((e: any, task:taskType) => {
        e.stopPropagation();
        barStatus = {
            dragging : true,
            pageX : e.pageX,
            element : e.target,
            left : parseInt(e.currentTarget?.style.left.replace('px', '')),
            animationLeft : parseInt(e.currentTarget?.style.left.replace('px', '')),
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
    const stopDrag = ((e:any) => {
        if (barStatus.dragging) {
            let diff = e.pageX - barStatus.pageX;
            let days = Math.ceil(diff / blockSize);
            debugger
            if (days !== 0) {
                taskMove(barStatus.taskId, days);
            }
        }


        barStatus.dragging = false
    });
    
    return (
        <div id="gantt-bar-area" className="relative" style={{width:`${calendarWidth}px`,height:`${calendarHeigth}px`}}>
            {projects.map((project, index) => {
                return (
                    <div key={index}>
                        <div style={project.style} className="rounded-lg absolute h-5 bg-lime-100" v-if="bar.list.cat === 'task'">
                            <div className="w-full h-full">
                            </div>
                        </div>
                        {tasks.filter(task => task.task.projectId === project.project.id).map((task, taskIndex) => {
                            return (
                                <div key={taskIndex} style={task.style} className="rounded-lg absolute h-5 bg-yellow-100" onMouseDown={(e) => {mouseDownMove(e, task.task)}}>
                                    <div className="w-full h-full pointer-events-none">
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