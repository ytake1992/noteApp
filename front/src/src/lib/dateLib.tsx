import {parse, format} from 'date-fns'

const getToday = ():Date => {
    let today = new Date()
    return today;
}
const getFirstDate = (date:Date):Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
const getLastDate = (date:Date):Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

const dateAdd = (date:Date, add:number, type:'year'|'month'|'day'):Date => {
    let newDate = new Date(date.getTime());
    switch (type) {
        case 'year':
            newDate.setFullYear(newDate.getFullYear() + add);
            break;
        case 'month':
            newDate = new Date(date.getFullYear(), date.getMonth() + add, 1);
            if (date.getDate() - getLastDate(newDate).getDate() > 0) {
                newDate.setDate(getLastDate(newDate).getDate());
            }else {
                newDate.setDate(date.getDate());
            }
            break;
        case 'day':
            newDate.setDate(newDate.getDate() + add);
            break;
        default:
            throw new Error('type argment is invalid');
    }

    return newDate;
}

const dateDiff = (befor:Date, after:Date, type:'year'|'month'|'day'):number => {
    switch (type) {
        case 'year':
            return after.getFullYear() - befor.getFullYear();
        case 'month':
            const yearDiff = dateDiff(befor,after,'year');
            return (after.getMonth()  + (12 * yearDiff)) - befor.getMonth();
        case 'day':
            const diffTime = after.getTime() - befor.getTime();
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
        default:
            throw new Error('type argment is invalid');
    }
}

const dateParse = (dateString:string, type:string) => {
    return parse(dateString, type, new Date())
}

const dateFormat = (date:Date, type:string) => {
    return format(date, type)
}

export {getToday, dateAdd, getFirstDate, getLastDate, dateDiff, dateParse, dateFormat}