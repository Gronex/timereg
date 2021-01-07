using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Gronia.Timereg.Domain;

namespace Gronia.Timereg.Application
{
    public interface IRegistrationDatabase
    {
        ValueTask<TimeRegistration?> Get(Guid key);

        ValueTask<IEnumerable<TimeRegistration>> GetAll();

        ValueTask Put(TimeRegistration value);

        ValueTask Delete(Guid key);
    }
}
