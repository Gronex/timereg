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
            return registrations.Where(x => !date.HasValue || x.Date == date.Value.Date);
        }

        public ValueTask<TimeRegistration?> GetRegistrationAsync(Guid id)
        {
            return _database.Get(id);
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
    }
}
