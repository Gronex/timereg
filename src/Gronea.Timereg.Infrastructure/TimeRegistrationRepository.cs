using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronea.Timereg.Application;
using Gronea.Timereg.Domain;

namespace Gronea.Timereg.Infrastructure
{
    public class TimeRegistrationRepository : ITimeRegistrationRepository
    {
        private static List<TimeRegistration> _registrations = new List<TimeRegistration>
        {
            new TimeRegistration
                {
                    Id = Guid.NewGuid(),
                    Date = DateTimeOffset.UtcNow.Date,
                    Description = "Test 1",
                    Project = "P1",
                    StartTime = TimeSpan.Zero,
                    StopTime = TimeSpan.FromHours(1.5)
                },
                new TimeRegistration
                {
                    Id = Guid.NewGuid(),
                    Date = DateTimeOffset.UtcNow.Date.AddDays(1),
                    Description = "Test 2",
                    Project = "P1",
                    StartTime = TimeSpan.Zero,
                    StopTime = TimeSpan.FromHours(2)
                },
                new TimeRegistration
                {
                    Id = Guid.NewGuid(),
                    Date = DateTimeOffset.UtcNow.Date,
                    Description = "Test 3",
                    Project = "P2",
                    StartTime = TimeSpan.FromHours(5),
                    StopTime = TimeSpan.FromHours(7)
                }
        };

        public Task<Guid> CreateRegistrationAsync(TimeRegistration registration)
        {
            var id = Guid.NewGuid();
            _registrations.Add(registration with { Id = id });
            return Task.FromResult(id);
        }

        public async Task DeleteRegistrationAsync(Guid id)
        {
            TimeRegistration? registration = await GetRegistrationAsync(id);
            if(registration == null)
            {
                return;
            }

            _registrations.Remove(registration);
        }

        public Task<IEnumerable<TimeRegistration>> GetAllRegistrationAsync(DateTime? date)
        {
            return Task.FromResult(_registrations.Where(x => !date.HasValue || x.Date == date.Value.Date));
        }

        public Task<TimeRegistration?> GetRegistrationAsync(Guid id)
        {
            return Task.FromResult(_registrations.FirstOrDefault(x => x.Id == id));
        }

        public Task UpdateRegistrationAsync(Guid id, TimeRegistration registration)
        {
            var reg = _registrations.FirstOrDefault(x => x.Id == id);
            if(reg is null)
            {
                throw new KeyNotFoundException($"Unable to find {id} in list of registrations");
            }
            _registrations.Remove(reg);
            _registrations.Add(registration with { Id = id });
            return Task.CompletedTask;
        }
    }
}
