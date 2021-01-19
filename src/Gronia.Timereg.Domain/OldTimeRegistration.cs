using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.IndexedDb;

namespace Gronia.Timereg.Domain
{
    public record OldTimeRegistration : IDbModel<int>
    {
        public int Id { get; init; }

        public DateTime Date { get; init; }

        public string? Description { get; init; }

        public string? Project { get; init; }

        public double Hours { get; init; }
    }
}
