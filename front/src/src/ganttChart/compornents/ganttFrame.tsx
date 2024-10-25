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
    const [startMonth, setStartMonth] = useState<string>(dateFormat(getFirstDate(dateAdd(getToday(), -2, 'month')),'yyyy-MM-dd'));
    const [endMonth, setEndMonth] = useState<string>(dateFormat(getLastDate(dateAdd(getToday(), 2, 'month')),'yyyy-MM-dd'));

    const [refProjectData, setRefProjectData] = useState<projectType[]>(setProjectDate(projects, tasks));
    const [refTaskData, setRefTaskDate] = useState<taskType[]>(setTaskDate(tasks));

    useEffect(() => {
        getWindowSize();
    },[]);
    
    const getWindowSize = () => {
        const taskContent = document.getElementById('gantt-task-title');
        if (taskContent !== null) {
            setCalendarWidth(window.innerWidth - taskContent.offsetWidth);
            setCalendarHeigth(window.innerHeight - taskContent.offsetHeight);
        }
    }

    const calendarStatus = {
        start:dateParse(startMonth,'yyyy-MM-dd'),
        end:dateParse(endMonth,'yyyy-MM-dd'),
        blockSize:30,
        calendarWidth:calendarWidth,
        calendarHeigth:calendarHeigth
    }
    
    const shiftMonth = (offset:number) => {
        const newStartMonth = dateAdd(dateParse(startMonth,'yyyy-MM-dd'), offset, 'month')
        const newEndMonth = dateAdd(dateParse(endMonth,'yyyy-MM-dd'), offset, 'month')
        setStartMonth(dateFormat(newStartMonth, 'yyyy-MM-dd'));
        setEndMonth(dateFormat(newEndMonth, 'yyyy-MM-dd'));
    }

    const taskMove = (taskId:number, offset:number) => {
        let newTasks = tasks;
        let newTask = newTasks.find(task => task.id === taskId);
        if (newTask) {
            let startDate = dateAdd(dateParse(newTask.startDate,'yyyy-MM-dd'), offset, 'day');
            let endDate = dateAdd(dateParse(newTask.endDate,'yyyy-MM-dd'), offset, 'day');
            newTask['startDate'] = dateFormat(startDate,'yyyy-MM-dd');
            newTask['endDate'] = dateFormat(endDate,'yyyy-MM-dd');
        }
        setRefProjectData(setProjectDate(projects, newTasks));
        setRefTaskDate(setTaskDate(newTasks));
    }

    return (
        <div id="gantt-content" className="flex">
            <div id="gantt-task">
                <GanttTaskHeader titles={Titles}/>
                {refProjectData.map((project, index) => {
                    const projectTasks = getProjectFilter(project.id, refTaskData)
                    return (
                        <TaskItems key={index} project={project} tasks={projectTasks}/>
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