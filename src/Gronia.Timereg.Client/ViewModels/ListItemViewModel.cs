﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gronia.Timereg.Client.ViewModels
{
    public record ListItemViewModel(string Title, IEnumerable<IconViewModel> Icons, string LinkUrl);

    public record IconViewModel(string Text, Icon Icon, string? AriaLabel = null)
    {
        public string IconPath => 
            Icon switch
            {
                Icon.Project => "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                Icon.Time => @"M13 2.05v2.02c3.95.49 7 3.85 7
            7.93 0 3.21-1.92 6-4.72 7.28L13
            17v5h5l-1.22-1.22C19.91 19.07 22
            15.76 22
            12c0-5.18-3.95-9.45-9-9.95M11
            2c-1.95.2-3.8.96-5.32 2.21L7.1
            5.63A8.195 8.195 0 0111 4V2M4.2
            5.68C2.96 7.2 2.2 9.05 2
            11h2c.19-1.42.75-2.77
            1.63-3.9L4.2 5.68M6
            8v2h3v1H8c-1.1 0-2 .9-2
            2v3h5v-2H8v-1h1c1.11 0 2-.89
            2-2v-1a2 2 0 00-2-2H6m6
            0v5h3v3h2v-3h1v-2h-1V8h-2v3h-1V8h-2M2
            13c.2 1.95.97 3.8 2.22
            5.32l1.42-1.42A8.21 8.21 0 014
            13H2m5.11 5.37l-1.43 1.42A10.04
            10.04 0 0011 22v-2a8.063 8.063 0
            01-3.89-1.63z",
                Icon.Number => "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
                _ => string.Empty
            };

        public string Stroke =>
            Icon switch
            {
                Icon.Number | Icon.Project => "currentColor",
                _ => string.Empty
            };
    }

    public enum Icon
    {
        Project,
        Time,
        Number
    }
}
