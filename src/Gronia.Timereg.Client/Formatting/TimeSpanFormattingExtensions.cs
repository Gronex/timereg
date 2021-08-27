using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gronia.Timereg.Client.Formatting
{
    public static class TimeSpanFormattingExtensions
    {
        public static string Format(this TimeSpan? timeSpan) => timeSpan?.Format() ?? string.Empty;

        public static string Format(this TimeSpan timeSpan) => $"{(int)timeSpan.TotalHours}:{timeSpan:mm\\:ss}";
    }
}
