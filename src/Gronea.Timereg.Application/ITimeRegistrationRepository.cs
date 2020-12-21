using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

using Gronea.Timereg.Domain;

namespace Gronea.Timereg.Application
{
    public interface ITimeRegistrationRepository
    {
        Task<TimeRegistration?> GetRegistrationAsync(Guid id);

        Task<IEnumerable<TimeRegistration>> GetAllRegistrationAsync(DateTime? date = null);

        Task<Guid> CreateRegistrationAsync(TimeRegistration registration);

        Task UpdateRegistrationAsync(Guid id, TimeRegistration registration);
    }
}
