using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using FluentValidation;

using Gronia.Timereg.Client.ViewModels;

using Microsoft.Extensions.Localization;

namespace Gronia.Timereg.Client.Validation
{
    public class RegistrationValidator : AbstractValidator<TimeRegistrationViewModel>
    {
        public RegistrationValidator(IStringLocalizer<RegistrationValidator> localizer)
        {
            RuleFor(x => x.Date).NotEmpty();

            When(x => x.StopTime == TimeSpan.Zero, () =>
            {
                RuleFor(x => x.StartTime).Empty().WithMessage(x => localizer["Start time must be empty if End time is not set"]);
            }).Otherwise(() =>
            {
                RuleFor(x => x.StopTime).GreaterThanOrEqualTo(x => x.StartTime).WithMessage(x => localizer["End Time must be greater or equal to Start time"]);
                RuleFor(x => x.Time).GreaterThanOrEqualTo(TimeSpan.Zero).WithMessage(x => localizer["Time must be a positive value"]);
            });
        }
    }
}
