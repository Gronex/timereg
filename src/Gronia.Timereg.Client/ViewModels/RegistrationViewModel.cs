using System;

using Gronia.Timereg.Domain;

namespace Gronia.Timereg.Client.ViewModels
{
    public record TimeRegistrationViewModel
    {
        public Guid Id { get; init; }

        public DateTimeOffset Date { get; set; }

        public string Project { get; set; }

        public string Description { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan? StopTime { get; set; }

        public TimeSpan? Time
        {
            get
            {
                TimeSpan? diff = (StopTime - StartTime);
                return diff < TimeSpan.Zero ? TimeSpan.Zero : diff;
            }
            set
            {
                StartTime = TimeSpan.Zero;
                StopTime = value is null ? null : StartTime + value;
            }
        }

        // TODO: Mapping should probably be its own thing

        public TimeRegistrationViewModel(TimeRegistration timeRegistration)
        {
            Id = timeRegistration.Id;
            Date = timeRegistration.Date;
            Project = timeRegistration.Project;
            Description = timeRegistration.Description;
            StartTime = timeRegistration.StartTime;
            StopTime = timeRegistration.StopTime;

        }

        public TimeRegistrationViewModel()
        {
            Project = string.Empty;
            Description = string.Empty;
        }

        public TimeRegistration ToDomainModel()
        {
            return new TimeRegistration
            {
                Date = Date,
                Description = Description,
                Project = Project,
                StartTime = StartTime,
                StopTime = StopTime
        };
        }
    }
}
