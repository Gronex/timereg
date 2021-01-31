using System;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Gronia.Timereg.Application;
using Gronia.Timereg.Infrastructure;
using Gronia.Timereg.Client.Pages;
using Gronia.Timereg.Client.Shared;
using FluentValidation;
using Gronia.Timereg.Client.Validation;
using Gronia.Timereg.Client.ViewModels;
using Gronia.Timereg.Domain;
using Gronia.Timereg.IndexedDb;

namespace Gronia.Timereg.Client
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");

            builder.Services.AddLocalization();

            ConfigureServices(builder, builder.Services);

            await builder
                .Build()
                .RunAsync();
        }

        private static void ConfigureServices(WebAssemblyHostBuilder builder, IServiceCollection services)
        {
            services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
            services.AddScoped<ITimeRegistrationRepository, TimeRegistrationRepository>();
            services.AddScoped<IDataMigrator, TimeRegistrationMigrator>();

            services.AddSingleton<RouteService>();

            services.Configure<IndexedDbSettings>(nameof(TimeRegistration), builder.Configuration.GetSection("IndexedDb"));
            services.AddScoped<IIndexedDbContext<TimeRegistration, Guid>, IndexedDbContext<TimeRegistration, Guid>>();

            services.AddTransient<IValidator<TimeRegistrationViewModel>, RegistrationValidator>();

            services.Configure<IndexedDbSettings>(nameof(OldTimeRegistration), builder.Configuration.GetSection("IndexedDbOld"));
            services.AddScoped<IIndexedDbContext<OldTimeRegistration, int>, IndexedDbContext<OldTimeRegistration, int>>();
        }
    }
}
