using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gronia.Timereg.Application
{
    public interface IDataMigrator
    {
        Task MigrateTimeRegistrations();

        Task ImportFromFile(Stream stream);

        Task<Stream> ExportData();
    }
}
