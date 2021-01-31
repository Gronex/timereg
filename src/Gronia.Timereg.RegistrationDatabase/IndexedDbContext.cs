using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.JSInterop;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gronia.Timereg.IndexedDb
{
    // This class provides an example of how JavaScript functionality can be wrapped
    // in a .NET class for easy consumption. The associated JavaScript module is
    // loaded on demand when first needed.
    //
    // This class can be registered as scoped DI service and then injected into Blazor
    // components for use.

    public class IndexedDbContext<TModel, TKey> : IAsyncDisposable, IIndexedDbContext<TModel, TKey>
        where TModel : IDbModel<TKey>
    {
        private readonly IndexedDbSettings _settings;

        private readonly Lazy<Task<IJSObjectReference>> _moduleTask;
        private readonly ILogger<IndexedDbContext<TModel, TKey>> _logger;

        public IndexedDbContext(IJSRuntime jsRuntime, IOptionsSnapshot<IndexedDbSettings> options, ILogger<IndexedDbContext<TModel, TKey>> logger)
        {
            _moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
               "import", "./_content/Gronia.Timereg.IndexedDb/dist/indexedDb.js").AsTask());
            _settings = options.Get(typeof(TModel).Name);
            _logger = logger;
        }

        public async ValueTask DisposeAsync()
        {
            if (_moduleTask.IsValueCreated)
            {
                IJSObjectReference module = await _moduleTask.Value;
                await module.DisposeAsync();
            }
        }

        public async ValueTask<TModel?> Get(TKey key)
        {
            IJSObjectReference module = await GetModule();
            return await module.InvokeAsync<TModel>("get", _settings.DatabaseName, StoreName, key);
        }

        public async ValueTask<IEnumerable<TModel>> GetAll()
        {
            IJSObjectReference module = await GetModule();
            return await module.InvokeAsync<IEnumerable<TModel>>("getAll", _settings.DatabaseName, StoreName);
        }

        public async ValueTask Put(TModel value)
        {
            IJSObjectReference module = await GetModule();
            await module.InvokeVoidAsync("put", _settings.DatabaseName, StoreName, value);
        }

        public async ValueTask Delete(TKey key)
        {
            IJSObjectReference module = await GetModule();
            await module.InvokeVoidAsync("remove", _settings.DatabaseName, StoreName, key);
        }

        private string StoreName => string.IsNullOrWhiteSpace(_settings.StoreName) ? typeof(TModel).Name : _settings.StoreName;

        private async Task<IJSObjectReference> GetModule()
        {
            IJSObjectReference module = await _moduleTask.Value;
            _logger.LogInformation("DB: {DBName}, Version: {Version}, Store: {StoreName}", _settings.DatabaseName, _settings.Version, StoreName);
            await module.InvokeVoidAsync("initDb", _settings.DatabaseName, _settings.Version, StoreName);
            return module;
        }
    }
}
