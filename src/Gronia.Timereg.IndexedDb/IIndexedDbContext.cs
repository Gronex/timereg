using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gronia.Timereg.IndexedDb
{
    public interface IIndexedDbContext<TModel, TKey>
        where TModel : IDbModel<TKey>
    {
        public ValueTask<TModel?> Get(TKey key);
        public ValueTask<IEnumerable<TModel>> GetAll();
        public ValueTask Put(TModel value);
        public ValueTask Delete(TKey key);
    }
}
