import { useState } from "react";

import type { projectType, taskType } from '../type/dataType';

export type dataType = {
    project: projectType;
    tasks: taskType[];
}

const TaskItems:React.FC<dataType> = ({project, tasks}) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <div id="gantt-task-list">
            <div className="flex h-10 border-b">
                <div className="flex items-center font-bold w-full text-sm pl-2  justify-between bg-teal-100">
                    {project.name}
                </div>
            </div>
                {!collapsed && tasks.map((task, index) => {
                    return (
                        <div key={index} className="flex h-10 border-b">
                            <div className="border-r flex items-center font-bold w-48 text-sm pl-4">
                                {task.name}
                            </div>
                            <div className="border-r flex items-center font-bold w-24 text-sm pl-4">
                                {task.startDate}
                            </div>
                            <div className="border-r flex items-center font-bold w-24 text-sm pl-4">
                                {task.endDate}
                            </div>
                            <div className="border-r flex items-center font-bold w-24 text-sm pl-4">
                                {task.inchargeUser}
                            </div>
                            <div className="border-r flex items-center font-bold w-24 text-sm pl-4">
                                {task.progress}%
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default TaskItems;