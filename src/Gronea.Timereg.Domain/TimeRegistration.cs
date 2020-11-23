using System;
using System.Collections.Generic;
using System.Text;

namespace Gronea.Timereg.Domain
{
    public record TimeRegistration
    {
        public Guid Id { get; init; }

        public DateTimeOffset Date { get; init; }

        public string Project { get; init; } = string.Empty;

        public string Description { get; init; } = string.Empty;

        public TimeSpan StartTime { get; init; }

        public TimeSpan? StopTime { get; init; }

    }
}
