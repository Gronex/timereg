using System;
using System.Collections.Generic;
using System.Linq;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.Execution;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Tools.Npm;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.EnvironmentInfo;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.DotNet.DotNetTasks;
using Nuke.Common.CI.GitHubActions;
using System.IO;

[CheckBuildProjectConfigurations]
[ShutdownDotNetAfterServerBuild]
[GitHubActions("Continuous",
    GitHubActionsImage.UbuntuLatest,
    PublishArtifacts = false,
    OnPullRequestBranches = new[] { DevelopBranch },
    OnPushBranches = new[] { MasterBranch, ReleaseBranchPrefix + "/*" },
    InvokedTargets = new[] { nameof(Publish) })]
class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode

    public static int Main () => Execute<Build>(x => x.Compile, x => x.BuildFrontend);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

    [Solution]
    readonly Solution Solution;

    [GitRepository]
    readonly GitRepository GitRepository;

    [GitVersion(Framework = "net5.0")]
    readonly GitVersion GitVersion;

    AbsolutePath SourceDirectory => RootDirectory / "src";
    AbsolutePath ArtifactsDirectory => RootDirectory / "artifacts";

    Project MainProject => Solution.GetProject("Gronia.Timereg.Client");

    const string MasterBranch = "master";
    const string DevelopBranch = "develop";
    const string ReleaseBranchPrefix = "release";
    const string HotfixBranchPrefix = "hotfix";


    IReadOnlyCollection<AbsolutePath> AditionalPaths = new[]
    {
        RootDirectory / "netlify.toml",
        RootDirectory / "_redirects",
    };

    Target RestoreNpmPackages => _ => _
        .Executes(() =>
        {
            NpmTasks.NpmCi();
        });

    Target BuildFrontend => _ => _
        .DependsOn(RestoreNpmPackages)
        .Before(Compile)
        .Executes(() =>
        {
            NpmTasks.NpmRun(s => s
                .SetCommand("buildcss")
                .When(Configuration == Configuration.Release, config => config.AddArguments("--environment", "BUILD:production"))
                .When(Configuration == Configuration.Release, config => config.SetProcessEnvironmentVariable("NODE_ENV", "production"))
            );
        }).Executes(() =>
        {
            NpmTasks.NpmRun(s => s
                .SetProcessWorkingDirectory(RootDirectory)
                .SetCommand("build-indexed-db")
                .When(Configuration == Configuration.Release, config => config.AddArguments("--environment", "BUILD:production"))
                .When(Configuration == Configuration.Release, config => config.SetProcessEnvironmentVariable("NODE_ENV", "production"))
            );
        });

    Target Clean => _ => _
        .Before(Restore)
        .Executes(() =>
        {
            SourceDirectory.GlobDirectories("**/bin", "**/obj").ForEach(DeleteDirectory);
            EnsureCleanDirectory(ArtifactsDirectory);
        });

    Target Restore => _ => _
        .Executes(() =>
        {
            DotNetRestore(s => s
                .SetProjectFile(Solution));
        });

    Target Compile => _ => _
        .DependsOn(Restore)
        .Executes(() =>
        {
            DotNetBuild(s => s
                .SetProjectFile(Solution)
                .SetConfiguration(Configuration)
                .SetAssemblyVersion(GitVersion.AssemblySemVer)
                .SetFileVersion(GitVersion.AssemblySemFileVer)
                .SetInformationalVersion(GitVersion.InformationalVersion)
                .EnableNoRestore());
        });

    Target Publish => _ => _
        .DependsOn(Clean)
        .DependsOn(Compile, BuildFrontend)
        .Produces(ArtifactsDirectory / "wwwroot")
        .Executes(() =>
        {
            DotNetPublish(s => s
                .SetProject(MainProject.Path)
                .SetConfiguration(Configuration)
                .EnableNoRestore()
                .EnableNoBuild()
                .SetOutput(ArtifactsDirectory)
                );
            CopyFileToDirectory(RootDirectory / "netlify.toml", ArtifactsDirectory / "wwwroot");
        });
}
