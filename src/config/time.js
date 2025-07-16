export const WEEKDAY = [
    { value: 0, label: "星期日" },
    { value: 1, label: "星期一" },
    { value: 2, label: "星期二" },
    { value: 3, label: "星期三" },
    { value: 4, label: "星期四" },
    { value: 5, label: "星期五" },
    { value: 6, label: "星期六" },
]
export const WEEKTIME = (weekIdx, scheduleStartTime, scheduleEndTime)=>{
    const weektime = WEEKDAY[weekIdx].label +
                     " " +
                     scheduleStartTime.slice(0,-3) +
                     " ~ " +
                     scheduleEndTime.slice(0,-3)

    return weektime
} 