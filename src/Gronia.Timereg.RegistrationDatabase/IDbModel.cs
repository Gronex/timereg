using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gronia.Timereg.IndexedDb
{
    public interface IDbModel<T>
    {
        public T Id { get; init; }
    }
}
