using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

using Gronia.Timereg.Domain.Serialization;

namespace Gronia.Timereg.Domain
{
    public record TimeRegistration
    {
        public Guid Id { get; init; }

        public DateTimeOffset Date { get; init; }

        public string Project { get; init; } = string.Empty;

        public string Description { get; init; } = string.Empty;

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan StartTime { get; init; }

        [JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan? StopTime { get; init; }

    }
}
