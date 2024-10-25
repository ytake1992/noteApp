import { useState, useEffect, useRef } from 'react'
import { ReactNode } from 'react'
import { dateAdd, dateDiff, getLastDate } from './../../lib/dateLib'

export type calenderStatus = {
    start: Date
    end: Date
    blockSize: number
    calendarWidth: number
    calendarHeigth: number
}

type Props = calenderStatus& {
    shiftMonthFn:Function
    children?:ReactNode
}

const GanttCalender:React.FC<Props> = ({start, end, blockSize, calendarWidth, calendarHeigth, shiftMonthFn, children}) => {
    const today = new Date()
    const [scrollPosition, setScrollPosition ] = useState<number>(0)
    const calendarRef = useRef<HTMLDivElement>(null);
    const leftScrollRef = useRef<HTMLDivElement>(null);
    const rightScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.scrollLeft = scrollDistance(today);
        }
    },[calendarWidth]);

    useEffect(() => {
        console.log(scrollPosition)
        if (calendarRef.current) {
            calendarRef.current.scrollLeft = scrollPosition === 0?scrollDistance(today):scrollPosition;
        }

        const options = {
            rootMargin: "0px",
            threshold: 0
        }
        const callBack = (entries:IntersectionObserverEntry[]) => {
            if(entries[0].isIntersecting && entries[0].target === leftScrollRef.current) {
                calendarShift('left');
            } else if (entries[0].isIntersecting && entries[0].target === rightScrollRef.current) {
                calendarShift('right');
            }
        }
        const scrollObserver = new IntersectionObserver(callBack, options);
        if (leftScrollRef.current && rightScrollRef.current) {
            scrollObserver.observe(leftScrollRef.current)
            scrollObserver.observe(rightScrollRef.current)
        }
        
        return () => {
            if (leftScrollRef.current && rightScrollRef.current) {
                scrollObserver.unobserve(leftScrollRef.current)
                scrollObserver.unobserve(rightScrollRef.current)
            }
        }
    },[start]);

    const scrollDistance = (today:Date) => {
        let betweenDays = dateDiff(start, today, 'day');
        return (betweenDays + 1) * blockSize - calendarWidth / 2;
    }

    const calendarShift = (mode: 'left'|'right') => {
        if (mode === 'left') {
            const numberOfDaysLastMonth = dateAdd(start,-1,'day').getDate();
            if (calendarRef.current) {
                console.log(calendarRef.current.scrollLeft + numberOfDaysLastMonth * blockSize)
                setScrollPosition(calendarRef.current.scrollLeft + numberOfDaysLastMonth * blockSize);
            }
            shiftMonthFn(-1);
        } else {
            const numberOfDaysThisMonth = getLastDate(start).getDate();
            if (calendarRef.current) {
                setScrollPosition(calendarRef.current.scrollLeft - numberOfDaysThisMonth * blockSize);
            }
            shiftMonthFn(1);
        }
    }

    const getDays = (year:number, month:number, blockNumber:number) => {
        const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
        let days = [];
        let date = new Date(year,month-1,1);
        let num = getLastDate(date).getDate();
            for (let i = 0; i < num; i++) {
            days.push({
                day: date.getDate(),
                dayOfWeek: dayOfWeek[date.getDay()],
                blockNumber
            })
            date.setDate(date.getDate() + 1);;
            blockNumber++;
        }
        return days;    
    }

    const getCalendar = (startMonth:Date, endMonth:Date) => {
        let yearMonth = new Date(startMonth.getTime());
        let calendars = []
        let blockNumber = 0;
        let days;
        let between_month = dateDiff(startMonth, endMonth, 'month')
        for (let i = 0; i <= between_month; i++) {
            days = getDays(yearMonth.getFullYear(), yearMonth.getMonth()+1, blockNumber);
            calendars.push({
                    year: yearMonth.getFullYear(),
                    month: yearMonth.getMonth() + 1,
                    startBlockNumber: blockNumber,
                    days: days
            })
            yearMonth = dateAdd(yearMonth, 1, 'month')
            blockNumber = days[days.length - 1].blockNumber
            blockNumber++;
        }
        return calendars;
    }

    const calendars = getCalendar(start, end);

    return (
        <div ref={calendarRef} id="gantt-calendar" className='overflow-x-scroll overflow-y-hidden border-l' style={{width:`${calendarWidth}px`}}>
            <div id="gantt-date" className="h-20">
                <div id="gantt-year-month" className="relative h-8">
                    {calendars.map((calendar, index) => {
                        return (
                            <div key={index} ref={(index === 0)?leftScrollRef:(index === calendars.length-1)?rightScrollRef:null} className="bg-indigo-700 text-white border-b border-r border-t h-8 absolute font-bold text-sm flex items-center justify-center"
                            style={{width:`${calendar.days.length*blockSize}px`, left:`${calendar.startBlockNumber*blockSize}px`}}>
                                {`${calendar.year}年${calendar.month}月`}
                            </div>
                        )
                    })}
                </div>
                <div id="gantt-day" className='relative h-12'>
                    {calendars.map((calendar, index) => {
                        return (
                            <div key={index}>
                                {calendar.days.map((day, index) => {
                                    return (
                                        <div key={index} className={`border-r h-12 absolute flex items-center justify-center flex-col font-bold text-xs 
                                                    ${day.dayOfWeek === '土' && 'bg-blue-100'} ${day.dayOfWeek ==='日' && 'bg-red-100'}
                                                    ${calendar.year=== today.getFullYear() && calendar.month === today.getMonth()+1 && day.day === today.getDate() && 'bg-red-600 text-white'}`}
                                        style={{width:`${blockSize}px`,left:`${day.blockNumber*blockSize}px`}}>
                                            <span>{day.day}</span>
                                            <span>{day.dayOfWeek}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    })}
                </div>
                <div id="gantt-height" className="relative">
                    {calendars.map((calendar, index) => {
                        return (
                            <div key={index}>
                                {calendar.days.map((day, index) => {
                                    return (
                                        <div key={index} className={`border-r border-b absolute
                                        ${day.dayOfWeek === '土' && 'bg-blue-100'} ${day.dayOfWeek ==='日' && 'bg-red-100'}`}
                                        style={{width:`${blockSize}px`,left:`${day.blockNumber*blockSize}px`, height:`${calendarHeigth}px`}}>
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
            { children }
        </div>
    )
}

export default GanttCalender;