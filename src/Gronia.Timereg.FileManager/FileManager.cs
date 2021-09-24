using Microsoft.JSInterop;

using System;
using System.Threading.Tasks;

namespace Gronia.Timereg.FileManager
{
    // This class provides an example of how JavaScript functionality can be wrapped
    // in a .NET class for easy consumption. The associated JavaScript module is
    // loaded on demand when first needed.
    //
    // This class can be registered as scoped DI service and then injected into Blazor
    // components for use.

    public class FileManager : IAsyncDisposable
    {
        private readonly Lazy<Task<IJSObjectReference>> _moduleTask;

        public FileManager(IJSRuntime jsRuntime)
        {
            _moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
               "import", "./_content/Gronia.Timereg.FileManager/fileManager.js").AsTask());
        }

        public async ValueTask DownloadFile(byte[] data, string filename, string mimeType)
        {
            var module = await _moduleTask.Value;
            await module.InvokeVoidAsync("downloadFile", data, filename, mimeType);
        }

        public async ValueTask DisposeAsync()
        {
            if (_moduleTask.IsValueCreated)
            {
                var module = await _moduleTask.Value;
                await module.DisposeAsync();
            }
        }
    }
}
