using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Domain;

namespace Gronia.Timereg.Application
{
    public interface ITimeRegistrationRepository
    {
        ValueTask<TimeRegistration?> GetRegistrationAsync(Guid id);

        ValueTask<IEnumerable<TimeRegistration>> GetAllRegistrationAsync(DateTime? date = null);

        ValueTask<Guid> CreateRegistrationAsync(TimeRegistration registration);

        ValueTask UpdateRegistrationAsync(Guid id, TimeRegistration registration);

        ValueTask DeleteRegistrationAsync(Guid id);
    }
}
