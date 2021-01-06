using Gronia.Timereg.Application;
using Gronia.Timereg.Domain;

using Microsoft.JSInterop;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gronia.Timereg.RegistrationDatabase
{
    // This class provides an example of how JavaScript functionality can be wrapped
    // in a .NET class for easy consumption. The associated JavaScript module is
    // loaded on demand when first needed.
    //
    // This class can be registered as scoped DI service and then injected into Blazor
    // components for use.

    public class RegistrationDatabase : IAsyncDisposable, IRegistrationDatabase
    {
        private const string StoreName = "registrations";

        private readonly Lazy<Task<IJSObjectReference>> _moduleTask;

        public RegistrationDatabase(IJSRuntime jsRuntime)
        {
            _moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
               "import", "./_content/Gronia.Timereg.RegistrationDatabase/registrationDatabase.js").AsTask());
        }

        public async ValueTask DisposeAsync()
        {
            if (_moduleTask.IsValueCreated)
            {
                IJSObjectReference module = await _moduleTask.Value;
                await module.DisposeAsync();
            }
        }

        public async ValueTask<TimeRegistration> Get(Guid key)
        {
            IJSObjectReference module = await _moduleTask.Value;
            return await module.InvokeAsync<TimeRegistration>("get", StoreName, key);
        }

        public async ValueTask<IEnumerable<TimeRegistration>> GetAll()
        {
            IJSObjectReference module = await _moduleTask.Value;
            return await module.InvokeAsync<IEnumerable<TimeRegistration>>("getAll", StoreName);
        }

        public async ValueTask<TimeRegistration> Put(TimeRegistration value)
        {
            IJSObjectReference module = await _moduleTask.Value;
            return await module.InvokeAsync<TimeRegistration>("put", StoreName, value);
        }

        public async ValueTask Delete(Guid key)
        {
            IJSObjectReference module = await _moduleTask.Value;
            await module.InvokeVoidAsync("remove", StoreName, key);
        }
    }
}
