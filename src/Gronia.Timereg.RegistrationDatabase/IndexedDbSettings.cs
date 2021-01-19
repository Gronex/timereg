using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gronia.Timereg.IndexedDb
{
    public record IndexedDbSettings
    {
        public string? DatabaseName { get; init; }

        public string? StoreName { get; init; }

        public int Version { get; init; } = 1;
    }
}
