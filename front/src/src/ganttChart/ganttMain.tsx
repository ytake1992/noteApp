import { useEffect, useState } from "react";
import GanttFrame from "./compornents/ganttFrame";

const END_POINT = 'http://127.0.0.1:5000'

const GanttMain:React.FC = () => {
    const [data, setData] = useState({projects:[], tasks:[]})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true);
        fetch(END_POINT + "/test_data")
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => console.error("Fetching data failed", error));
        setIsLoading(true);
      }, []);

    return (
        <>
            <GanttFrame projects={data.projects} tasks={data.tasks} isLoading={isLoading}/>
        </>
    )
}

export default GanttMain;