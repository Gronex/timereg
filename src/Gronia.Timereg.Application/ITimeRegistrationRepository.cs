using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Domain;

namespace Gronia.Timereg.Application
{
    public interface ITimeRegistrationRepository
    {
        Task<TimeRegistration?> GetRegistrationAsync(Guid id);

        Task<IEnumerable<TimeRegistration>> GetAllRegistrationAsync(DateTime? date = null);

        Task<Guid> CreateRegistrationAsync(TimeRegistration registration);

        Task UpdateRegistrationAsync(Guid id, TimeRegistration registration);

        Task DeleteRegistrationAsync(Guid id);
    }
}
