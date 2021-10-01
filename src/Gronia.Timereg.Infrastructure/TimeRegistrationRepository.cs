using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Application;
using Gronia.Timereg.Domain;
using Gronia.Timereg.IndexedDb;

namespace Gronia.Timereg.Infrastructure
{
    public class TimeRegistrationRepository : ITimeRegistrationRepository
    {
        private readonly IIndexedDbContext<TimeRegistration, Guid> _database;

        public TimeRegistrationRepository(IIndexedDbContext<TimeRegistration, Guid> database)
        {
            _database = database;
        }

        public async ValueTask<Guid> CreateRegistrationAsync(TimeRegistration registration)
        {
            var id = Guid.NewGuid();
            await _database.Put(registration with { Id = id });
            return id;
        }

        public async ValueTask DeleteRegistrationAsync(Guid id)
        {
            TimeRegistration? registration = await GetRegistrationAsync(id);
            if(registration == null)
            {
                return;
            }

            await _database.Delete(id);
        }

        public async ValueTask<IEnumerable<TimeRegistration>> GetAllRegistrationAsync(DateTime? date)
        {
            IEnumerable<TimeRegistration> registrations = await _database.GetAll();
            return registrations
                .Select(FixDate)
                .Where(x => !date.HasValue || x!.Date == date.Value.Date)!;
        }

        public async ValueTask<TimeRegistration?> GetRegistrationAsync(Guid id)
        {
            return FixDate(await _database.Get(id));
        }

        public async ValueTask UpdateRegistrationAsync(Guid id, TimeRegistration registration)
        {
            TimeRegistration? reg = await _database.Get(id);
            if(reg is null)
            {
                throw new KeyNotFoundException($"Unable to find {id} in list of registrations");
            }
            await _database.Put(registration with { Id = id });
        }

        private TimeRegistration? FixDate(TimeRegistration? timeRegistration)
        {
            if (timeRegistration != null && timeRegistration.Date.Hour != 0)
            {
                // Earlier migrated data was setting timezone to utc time,
                // meaning the date is not directly parsable.
                // TODO: Handle when removeing time component on upgrade to .NET 6
                timeRegistration = timeRegistration with { Date = timeRegistration.Date.ToLocalTime() };
            }
            return timeRegistration;
        }
    }
}
