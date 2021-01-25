using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Application;
using Gronia.Timereg.Domain;
using Gronia.Timereg.IndexedDb;

using Microsoft.Extensions.Logging;

namespace Gronia.Timereg.Infrastructure
{
    public class TimeRegistrationMigrator : IDataMigrator
    {
        private readonly ILogger<TimeRegistrationMigrator> _logger;
        private readonly IIndexedDbContext<OldTimeRegistration, int> _dbContext;
        private readonly IIndexedDbContext<TimeRegistration, Guid> _dbContextTarget;

        public TimeRegistrationMigrator(ILogger<TimeRegistrationMigrator> logger, IIndexedDbContext<OldTimeRegistration, int> dbContext, IIndexedDbContext<TimeRegistration, Guid> dbContextTarget)
        {
            _logger = logger;
            _dbContext = dbContext;
            _dbContextTarget = dbContextTarget;
        }

        public async Task MigrateTimeRegistrations()
        {
            _logger.LogInformation("Migrating...");
            IEnumerable<OldTimeRegistration> registrations = await _dbContext.GetAll();

            IEnumerable<(OldTimeRegistration Old, TimeRegistration New)>? mappedRegistrations = registrations
                .Where(x => x.NewId.HasValue)
                .Select(reg => (reg, new TimeRegistration
                {
                    Id = Guid.NewGuid(),
                    Date = reg.Date,
                    Description = reg.Description ?? string.Empty,
                    Project = reg.Project ?? string.Empty,
                    StartTime = TimeSpan.Zero,
                    StopTime = TimeSpan.FromHours(reg.Hours)
                }));


            foreach((OldTimeRegistration Old, TimeRegistration New) in mappedRegistrations)
            {
                _logger.LogInformation("Adding {registration}", New);
                await _dbContextTarget.Put(New);

                _logger.LogInformation("Updating {registration}", Old);
                await _dbContext.Put(Old with { NewId = New.Id });
            }

            _logger.LogInformation("Migration done.");
        }
    }
}
