using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Gronia.Timereg.Client.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime GetFirstDayOfWeek(this DateTime date)
        {
            var dayOfWeek = (int)date.DayOfWeek - 1;
            if(date.DayOfWeek == DayOfWeek.Sunday)
            {
                dayOfWeek = 6;
            }
            return date.AddDays(-dayOfWeek);
        }
        /// <summary>
        /// This presumes that weeks start with Monday.
        /// Week 1 is the 1st week of the year with a Thursday in it.
        /// 
        /// <see cref="https://docs.microsoft.com/en-gb/archive/blogs/shawnste/iso-8601-week-of-year-format-in-microsoft-net"/>
        /// </summary>
        /// <param name="date"></param>
        /// <returns>Week of year according to ISO8601</returns>
        public static int GetIso8601WeekOfYear(this DateTime date)
        {
            Calendar? calendar = CultureInfo.InvariantCulture.Calendar;

            // Seriously cheat. If its Monday, Tuesday or Wednesday, then it'll
            // be the same week# as whatever Thursday, Friday or Saturday are,
            // and we always get those right
            DayOfWeek day = calendar.GetDayOfWeek(date);
            if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
            {
                date = date.AddDays(3);
            }

            // Return the week of our adjusted day
            return calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        }
    }
}
