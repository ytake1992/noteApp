import { useState, useEffect } from 'react'
import { ReactNode } from 'react'

import GanttTaskHeader from "./ganttTaskHeader";
import type { headertitle } from "./ganttTaskHeader";
import GanttCalender from "./ganttCalender";
import TaskItems from './taskItems';
import TaskBarItems from './taskBarItems';

import type { projectType, taskType } from '../type/dataType';
import { setProjectDate, getProjectFilter, setTaskDate } from '../../lib/dataLib';

import { getToday, dateAdd, getFirstDate, getLastDate, dateParse, dateFormat } from '../../lib/dateLib'


export type frameProps = {
    taskItems: ReactNode,
    taskBarItems: ReactNode;
} 

export type dataType = {
    projects: projectType[];
    tasks: taskType[];
}

const Titles:headertitle[] = [
    {
        name:'タスク',
        width: '12rem'
    },
    {
        name:'開始日',
        width: '6rem'
    },
    {
        name:'完了期限',
        width: '6rem'
    },
    {
        name:'担当',
        width: '6rem'
    },
    {
        name:'進捗',
        width: '6rem'
    },
]

const GanttFrame:React.FC<dataType> = ({projects, tasks}) => {
    const [calendarWidth, setCalendarWidth ] = useState<number>(0)
    const [calendarHeigth, setCalendarHeigth ] = useState<number>(0)
    const [startMonth, setStartMonth] = useState<Date>(getFirstDate(dateAdd(getToday(), -2, 'month')));
    const [endMonth, setEndMonth] = useState<Date>(getLastDate(dateAdd(getToday(), 2, 'month')));

    const [refProjectData, setRefProjectData] = useState<projectType[]>(setProjectDate(projects, tasks));
    const [refTaskData, setRefTaskDate] = useState<taskType[]>(setTaskDate(tasks));

    useEffect(() => {
        getWindowSize();
        window.addEventListener('resize', getWindowSize)
    },[]);
    
    const getWindowSize = () => {
        const taskContent = document.getElementById('gantt-task-title');
        if (taskContent !== null) {
            setCalendarWidth(window.innerWidth - taskContent.offsetWidth);
            setCalendarHeigth(window.innerHeight - taskContent.offsetHeight);
        }
    }

    const calendarStatus = {
        start:startMonth,
        end:endMonth,
        blockSize:30,
        calendarWidth:calendarWidth,
        calendarHeigth:calendarHeigth
    }
    
    const shiftMonth = (offset:number) => {
        const newStartMonth = dateAdd(startMonth, offset, 'month')
        const newEndMonth = dateAdd(endMonth, offset, 'month')
        setStartMonth(newStartMonth);
        setEndMonth(newEndMonth);
    }

    const taskMove = (taskId:number, startOffset:number, endOffset:number) => {
        let newTasks = tasks;
        let newTask = newTasks.find(task => task.id === taskId);
        if (newTask) {
            let startDate = dateAdd(dateParse(newTask.startDate,'yyyy-MM-dd'), startOffset, 'day');
            let endDate = dateAdd(dateParse(newTask.endDate,'yyyy-MM-dd'), endOffset, 'day');
            newTask['startDate'] = dateFormat(startDate,'yyyy-MM-dd');
            newTask['endDate'] = dateFormat(endDate,'yyyy-MM-dd');
        }
        setRefProjectData(setProjectDate(projects, newTasks));
        setRefTaskDate(setTaskDate(newTasks));
    }
    
    const setCollapsed = (projectId:number) => {
        let newProjects = projects;
        let newProject = newProjects.find(project => project.id === projectId);
        if (newProject) {
            newProject['collapsed'] = !newProject['collapsed'];
        }
        setRefProjectData(setProjectDate(projects, tasks));
    }

    return (
        <div id="gantt-content" className="flex">
            <div id="gantt-task">
                <GanttTaskHeader titles={Titles}/>
                {refProjectData.map((project, index) => {
                    const projectTasks = getProjectFilter(project.id, refTaskData)
                    return (
                        <TaskItems key={index} project={project} tasks={projectTasks} setCollapsed={setCollapsed}/>
                    )
                })}
            </div>

            <GanttCalender {...calendarStatus} shiftMonthFn={shiftMonth}>
                <TaskBarItems projects={refProjectData} tasks={refTaskData} {...calendarStatus} taskMove={taskMove}/>
            </GanttCalender>
        </div>
    )
}

export default GanttFrame;