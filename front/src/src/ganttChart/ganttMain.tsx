import GanttFrame from "./compornents/ganttFrame";

const GanttMain:React.FC = () => {
    const data = {
        projects: [
            {
                id: 1,
                name: 'テストA',
                startDate: null,
                endDate: null,
                collapsed: false,
            }, {
                id: 2,
                name: 'テストB',
                startDate: null,
                endDate: null,
                collapsed: false,
            }
        ],
        tasks: [
            {
            id: 1,
            projectId: 1,
            name: 'テスト1',
            startDate: '2024-10-18',
            endDate: '2024-10-20',
            inchargeUser: '鈴木',
            progress: 100,
            },
            {
            id: 2,
            projectId: 1,
            name: 'テスト2',
            startDate: '2024-10-19',
            endDate: '2024-10-23',
            inchargeUser: '佐藤',
            progress: 90,
            },
            {
            id: 3,
            projectId: 1,
            name: 'テスト3',
            startDate: '2024-10-04',
            endDate: '2024-10-19',
            inchargeUser: '鈴木',
            progress: 40,
            },
            {
            id: 4,
            projectId: 1,
            name: 'テスト4',
            startDate: '2024-10-21',
            endDate: '2024-10-30',
            inchargeUser: '山下',
            progress: 60,
            },
            {
            id: 5,
            projectId: 1,
            name: 'テスト5',
            startDate: '2024-10-10',
            endDate: '2024-10-24',
            inchargeUser: '佐藤',
            progress: 5,
            },
            {
            id: 6,
            projectId: 2,
            name: 'テスト6',
            startDate: '2024-10-08',
            endDate: '2024-10-28',
            inchargeUser: '佐藤',
            progress: 0,
            },
        ],
    }

    return (
        <>
            <GanttFrame projects={data.projects} tasks={data.tasks}/>
        </>
    )
}

export default GanttMain;