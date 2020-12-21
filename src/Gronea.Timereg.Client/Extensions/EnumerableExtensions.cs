using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gronea.Timereg.Client.Extensions
{
    public static class EnumerableExtensions
    {
        public static TimeSpan Sum<T>(this IEnumerable<T> source, Func<T, TimeSpan?> selector)
        {
            TimeSpan sum = TimeSpan.Zero;
            foreach(T item in source ?? Enumerable.Empty<T>())
            {
                sum += selector(item) ?? TimeSpan.Zero;
            }
            return sum;
        }
    }
}
