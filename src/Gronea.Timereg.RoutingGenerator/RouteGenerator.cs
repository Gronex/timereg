using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;

// https://sourcegen.dev/ to test
namespace Gronea.Timereg.RoutingGenerator
{
    [Generator]
    public class RouteGenerator : ISourceGenerator
    {
        public void Execute(GeneratorExecutionContext context)
        {
            // retreive the populated receiver 
            if (context.SyntaxReceiver is not SyntaxReceiver receiver)
            {
                return;
            }

            Compilation? compilation = context.Compilation;

            INamedTypeSymbol? routesAttribute = compilation?.GetTypeByMetadataName("Microsoft.AspNetCore.Components.RouteAttribute");
            if(routesAttribute is null || compilation is null)
            {
                return;
            }

            var classSymbols = new List<(INamedTypeSymbol page, AttributeData attribute)>();

            foreach(ClassDeclarationSyntax cls in receiver.CandidateClasses)
            {
                SemanticModel model = compilation.GetSemanticModel(cls.SyntaxTree);

                INamedTypeSymbol? classSymbol = model.GetDeclaredSymbol(cls);

                AttributeData? attribute = classSymbol?.GetAttributes().FirstOrDefault(attr => attr?.AttributeClass?.Name == "RouteAttribute");
                if (attribute != null)
                {
                    classSymbols.Add((classSymbol!, attribute!));
                }
            }

            if (classSymbols.Any())
            {
                var stringBuilder = new StringBuilder();
                var namespaceName = classSymbols.First().page.ContainingNamespace.ToDisplayString();
                var className = "RouteService";

                stringBuilder.Append($@"
using System;
namespace {namespaceName}
{{
    public partial class {className}
    {{
    ");
                foreach ((INamedTypeSymbol page, AttributeData attribute) in classSymbols)
                {
                    AddRouteFunctions(page, attribute, stringBuilder);

                }
                stringBuilder.Append(@"
    }
}");
                var source = SourceText.From(stringBuilder.ToString(), Encoding.UTF8);
                context.AddSource(className, source);
            }
        }

        public void Initialize(GeneratorInitializationContext context)
        {
            // Register a syntax receiver that will be created for each generation pass
            context.RegisterForSyntaxNotifications(() => new SyntaxReceiver());
            //Debugger.Launch();
        }

        private void AddRouteFunctions(INamedTypeSymbol page, AttributeData attribute, StringBuilder stringBuilder)
        {
            var tokenRegex = new Regex(@"\{(?<replacementToken>.+?)\}");
            var template = attribute.ConstructorArguments.First().Value?.ToString() ?? string.Empty;

            MatchCollection? matches = tokenRegex.Matches(template);

            var args = new List<(string type, string param, bool optional)>();
            foreach (var match in matches)
            {
                foreach (var token in (match as Match)!.Groups["replacementToken"].Captures)
                {
                    (string TypeName, string ParameterName, bool Optional) parameter = GetParameter(token.ToString());
                    args.Add(parameter);
                    template = template.Replace(token.ToString(), RenderReplacementToken(parameter.TypeName, parameter.ParameterName, parameter.Optional));
                }
            }

            stringBuilder.Append($@"
        public string Get{page.Name}Route({string.Join(", ", args.Select(x => RenderParameter(x.type, x.param, x.optional)))})
        {{
            return $""{template}"";
        }}
");
        }

        private string RenderReplacementToken(string type, string parameterName, bool optional)
        {
            if (optional)
            {
                type = type.TrimEnd('?');
            }

            string formatter = (type) switch
            {
                nameof(DateTime) => $"{(optional ? "?" : string.Empty)}.ToString(\"d\", {typeof(System.Globalization.CultureInfo).FullName}.InvariantCulture)",
                _ => string.Empty,
            };

            return $"{parameterName}{formatter}";
        }

        private string RenderParameter(string typeName, string parameterName, bool optional)
        {
            var param = $"{typeName} {parameterName}";
            if (optional)
            {
                param += " = null";
            }
            return param;
        }

        private (string TypeName, string ParameterName, bool Optional) GetParameter(string match)
        {
            var parts = match.Split(':');

            var type = parts.Length > 1 ? parts[1] : "string";

            bool optional = match.Contains('?');
            var trimmed = type.Replace("?", string.Empty);
            type = (trimmed) switch
            {
                "datetime" => nameof(DateTime),
                "guid" => nameof(Guid),
                _ => trimmed,
            };

            type += optional ? "?" : string.Empty;

            return (type, parts[0].Replace("?", string.Empty), optional);
        }
    }

    /// <summary>
    /// Created on demand before each generation pass
    /// </summary>
    class SyntaxReceiver : ISyntaxReceiver
    {
        public List<ClassDeclarationSyntax> CandidateClasses { get; } = new List<ClassDeclarationSyntax>();

        /// <summary>
        /// Called for every syntax node in the compilation, we can inspect the nodes and save any information useful for generation
        /// </summary>
        public void OnVisitSyntaxNode(SyntaxNode syntaxNode)
        {
            // any field with at least one attribute is a candidate for property generation
            if (syntaxNode is ClassDeclarationSyntax classDeclarationSyntax
                && classDeclarationSyntax.AttributeLists.Count > 0
                )
            {
                CandidateClasses.Add(classDeclarationSyntax);
            }
        }
    }
}
