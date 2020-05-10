
[CmdletBinding()]
param (
    [Parameter()]
    [string]
    $PreRelease
)

function ConvertTo-Hashtable {
  [CmdletBinding()]
  param (
    [Parameter(ValueFromPipeline)]
    [PSObject]
    $InputObject,
    [Parameter(Mandatory)]
    $KeyProperty,
    [Parameter(Mandatory)]
    $ValueProperty
  )

  begin {
    $table = @{}
  }

  process {
    $key = $InputObject | Select-Object -ExpandProperty $KeyProperty
    $value = $InputObject | Select-Object -ExpandProperty $ValueProperty
    $table.Add($key, $value)
  }

  end {
    $table
  }
}

function New-BuildMeta {
  param (
    $sha
  )

  $runId = $env:GITHUB_RUN_ID
  $buildNumber = $env:GITHUB_RUN_NUMBER

  $buildMeta = @()

  if (![String]::IsNullOrWhiteSpace($runId)) {
    $buildMeta += "pipeline.$runId"
  }
  if (![String]::IsNullOrWhiteSpace($buildNumber)) {
    $buildMeta += "build.$buildNumber"
  }
  if (![String]::IsNullOrWhiteSpace($sha)) {
    $buildMeta += "revision.$sha"
  }

  return $buildMeta -join "-"
}

$ErrorActionPreference = 'stop';

$describe = & 'git' 'describe' '--always'

$describeMatch = '^((v)?(?<version>.*)-)?((?<ahead>\d+)-)?(g?(?<sha>\S{7}))$'

Write-Host "DescribeResult: $describe"

$describeCheck = $describe | Select-String -Pattern $describeMatch

if (!$describeCheck.Matches.Success) {
  throw "No version found in '$describe'"
}

$groups = $describeCheck.Matches.Groups | ConvertTo-Hashtable -KeyProperty Name -ValueProperty Value
$sha = $groups['sha']

Write-Host "Current Sha: $sha"

$date = (Get-Date).ToUniversalTime()

$version = @{
  Major = $date.Year;
  Minor = $date.DayOfYear;
  Patch = [int]$date.TimeOfDay.TotalSeconds;
  PreRelease = $PreRelease;
  Build = New-BuildMeta -sha $sha;
}

$full = "$($version.Major).$($version.Minor).$($version.Patch)"

if (![String]::IsNullOrWhiteSpace($version.PreRelease)) {
  $full += "-$($version.PreRelease)"
}

if (![String]::IsNullOrWhiteSpace($version.Build)) {
  $full += "+$($version.Build)"
}

$version.Full = $full;

$version | Format-Table

ConvertTo-Json $version | New-Item -Path "./timereg.version.json" -Force
