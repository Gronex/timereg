using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Gronia.Timereg.Domain.Serialization
{
    public class TimeSpanConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var str = reader.GetString();
            if (!TimeSpan.TryParseExact(str, "c", null, System.Globalization.TimeSpanStyles.None, out TimeSpan timeSpan))
            {
                throw new JsonException($"Could not convert value '{str}' to TimeSpan. Only supported format is 'c'");
            }
            return timeSpan;
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("c"));
        }
    }
}
