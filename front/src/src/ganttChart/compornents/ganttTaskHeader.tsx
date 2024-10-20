export type headertitle = {
        name : string,
        width: string
};

export type headerProps = {
    titles: headertitle[];
} 

const GanttTaskHeader:React.FC<headerProps> = ({titles}) => {
    return (
        <>
            <div id="gantt-task-title" className="flex items-center bg-green-600 text-white h-20">
                {titles.map((title, index) => {
                    return (
                        <div key={index} className="border-t border-r border-b flex items-center justify-center font-bold text-xs h-full"
                        style={{width:title.width}}>
                            {title.name}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default GanttTaskHeader;