using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Rendering;

namespace Gronea.Timereg.Client.Shared
{
    public class InputTime<TValue> : InputBase<TValue>
    {
        private const string _timeFormat = "HH:mm:ss";
        private const string _timeSpanFormat = "hh':'mm':'ss";

        /// <summary>
        /// Gets or sets the error message used when displaying an a parsing error.
        /// </summary>
        [Parameter] public string ParsingErrorMessage { get; set; } = "The {0} field must be a time in the format {1}, was {2}.";

        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            builder.OpenElement(0, "input");
            builder.AddMultipleAttributes(1, AdditionalAttributes);
            builder.AddAttribute(2, "type", "time");
            builder.AddAttribute(3, "class", CssClass);
            builder.AddAttribute(4, "value", BindConverter.FormatValue(CurrentValueAsString));
            builder.AddAttribute(5, "onchange", EventCallback.Factory.CreateBinder<string?>(this, __value => CurrentValueAsString = __value, CurrentValueAsString));
            builder.CloseElement();
        }

        /// <inheritdoc />
        protected override string FormatValueAsString(TValue? value)
        {
            return value switch
            {
                DateTime dateTimeValue => BindConverter.FormatValue(dateTimeValue, _timeFormat, CultureInfo.InvariantCulture),
                DateTimeOffset dateTimeOffsetValue => BindConverter.FormatValue(dateTimeOffsetValue, _timeFormat, CultureInfo.InvariantCulture),
                TimeSpan timeSpanValue => timeSpanValue.ToString(_timeSpanFormat, CultureInfo.InvariantCulture),
                null => string.Empty,// Handles null for Nullable<DateTime>, etc.
                _ => throw new NotSupportedException($"'{value.GetType().Name}' is not a supported type for InputTime"),
            };
        }

        protected override bool TryParseValueFromString(string? value, [MaybeNullWhen(false)] out TValue result, [NotNullWhen(false)] out string? validationErrorMessage)
        {
            // Unwrap nullable types. We don't have to deal with receiving empty values for nullable
            // types here, because the underlying InputBase already covers that.
            var targetType = Nullable.GetUnderlyingType(typeof(TValue)) ?? typeof(TValue);

            bool success;

            if(targetType == typeof(DateTime))
            {
                success = TryParseDateTime(value, out result);
            }
            else if (targetType == typeof(DateTimeOffset))
            {
                success = TryParseDateTimeOffset(value, out result);
            }
            else if (targetType == typeof(TimeSpan))
            {
                success = TryParseTimeSpan(value, out result);
            }
            else
            {
                throw new InvalidOperationException($"The type '{targetType}' is not a supported time type.");
            }

            validationErrorMessage = success
                ? null
                : string.Format(CultureInfo.InvariantCulture, ParsingErrorMessage, DisplayName ?? FieldIdentifier.FieldName, _timeFormat, value);
            return success;
        }

        private static bool TryParseDateTime(string? value, [MaybeNullWhen(false)] out TValue result)
        {
            var success = BindConverter.TryConvertToDateTime(value, CultureInfo.InvariantCulture, _timeFormat, out var parsedValue);
            if (success)
            {
                result = (TValue)(object)parsedValue;
                return true;
            }
            else
            {
                result = default;
                return false;
            }
        }

        private static bool TryParseDateTimeOffset(string? value, [MaybeNullWhen(false)] out TValue result)
        {
            var success = BindConverter.TryConvertToDateTimeOffset(value, CultureInfo.InvariantCulture, _timeFormat, out var parsedValue);
            if (success)
            {
                result = (TValue)(object)parsedValue;
                return true;
            }
            else
            {
                result = default;
                return false;
            }
        }

        private static bool TryParseTimeSpan(string? value, [MaybeNullWhen(false)] out TValue result)
        {
            var success = TimeSpan.TryParseExact(value, _timeSpanFormat, CultureInfo.InvariantCulture, out var parsedValue);
            if (success)
            {
                result = (TValue)(object)parsedValue;
                return true;
            }
            else
            {
                result = default;
                return false;
            }
        }
    }
}
