using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Application;

using Microsoft.Extensions.Logging;

namespace Gronia.Timereg.Infrastructure
{
    public class TimeRegistrationMigrator : IDataMigrator
    {
        private readonly ILogger<TimeRegistrationMigrator> _logger;

        public TimeRegistrationMigrator(ILogger<TimeRegistrationMigrator> logger)
        {
            _logger = logger;
        }

        public Task MigrateTimeRegistrations()
        {
            _logger.LogInformation("Migrating...");
            return Task.Delay(10_000);
        }
    }
}
