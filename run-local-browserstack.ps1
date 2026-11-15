[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [ValidateSet('smoke', 'sanity', 'regression', 'all')]
    [string]$Suite = 'smoke',

    [ValidateSet(
        'windows11-chrome',
        'windows10-chrome',
        'windows11-edge',
        'windows11-firefox',
        'macos-14-safari',
        'samsung-s25-chrome',
        'samsung-s24-chrome',
        'pixel10-chrome',
        'pixel9-chrome',
        'windows-chrome',
        'windows-edge',
        'windows-firefox',
        'macos-safari'
    )]
    [string]$Target = 'windows11-chrome',

    [switch]$FullMatrix
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$bsConfigPath = Join-Path $repoRoot 'browserstack.yml'
if (-not (Test-Path $bsConfigPath)) {
    throw "browserstack.yml was not found in $repoRoot."
}

$bsText = Get-Content -Path $bsConfigPath -Raw
$userName = if ($bsText -match '(?m)^userName:\s*(.+)$') { $Matches[1].Trim() } else { throw 'userName is missing in browserstack.yml' }
$accessKey = if ($bsText -match '(?m)^accessKey:\s*(.+)$') { $Matches[1].Trim() } else { throw 'accessKey is missing in browserstack.yml' }
$projectName = if ($bsText -match '(?m)^projectName:\s*(.+)$') { $Matches[1].Trim() } else { 'OrangeHRM Playwright Automation' }
$buildName = if ($bsText -match '(?m)^buildName:\s*(.+)$') { $Matches[1].Trim() } else { 'Local BrowserStack Run' }

$platformMap = @{
    'windows11-chrome' = @{ os = 'Windows'; osVersion = '11'; browserName = 'chrome'; browserVersion = 'latest'; name = 'windows11-chrome'; deviceName = $null }
    'windows10-chrome' = @{ os = 'Windows'; osVersion = '10'; browserName = 'chrome'; browserVersion = 'latest'; name = 'windows10-chrome'; deviceName = $null }
    'windows11-edge' = @{ os = 'Windows'; osVersion = '11'; browserName = 'edge'; browserVersion = 'latest'; name = 'windows11-edge'; deviceName = $null }
    'windows11-firefox' = @{ os = 'Windows'; osVersion = '11'; browserName = 'firefox'; browserVersion = 'latest'; name = 'windows11-firefox'; deviceName = $null }
    'macos-14-safari' = @{ os = 'OS X'; osVersion = '14'; browserName = 'safari'; browserVersion = 'latest'; name = 'macos-14-safari'; deviceName = $null }
    'samsung-s25-chrome' = @{ os = 'Android'; osVersion = '15'; browserName = 'chrome'; browserVersion = 'latest'; name = 'samsung-s25-chrome'; deviceName = 'Samsung Galaxy S25' }
    'samsung-s24-chrome' = @{ os = 'Android'; osVersion = '14'; browserName = 'chrome'; browserVersion = 'latest'; name = 'samsung-s24-chrome'; deviceName = 'Samsung Galaxy S24' }
    'pixel10-chrome' = @{ os = 'Android'; osVersion = '16'; browserName = 'chrome'; browserVersion = 'latest'; name = 'pixel10-chrome'; deviceName = 'Google Pixel 10' }
    'pixel9-chrome' = @{ os = 'Android'; osVersion = '15'; browserName = 'chrome'; browserVersion = 'latest'; name = 'pixel9-chrome'; deviceName = 'Google Pixel 9' }
    'windows-chrome' = @{ os = 'Windows'; osVersion = '11'; browserName = 'chrome'; browserVersion = 'latest'; name = 'windows11-chrome'; deviceName = $null }
    'windows-edge' = @{ os = 'Windows'; osVersion = '11'; browserName = 'edge'; browserVersion = 'latest'; name = 'windows11-edge'; deviceName = $null }
    'windows-firefox' = @{ os = 'Windows'; osVersion = '11'; browserName = 'firefox'; browserVersion = 'latest'; name = 'windows11-firefox'; deviceName = $null }
    'macos-safari' = @{ os = 'OS X'; osVersion = '14'; browserName = 'safari'; browserVersion = 'latest'; name = 'macos-14-safari'; deviceName = $null }
}

function New-BrowserStackYaml {
    param(
        [hashtable]$PlatformConfig
    )

    $lines = @(
        "userName: $userName",
        "accessKey: $accessKey",
        "projectName: $projectName",
        "buildName: $buildName",
        "buildIdentifier: '#local'",
        'framework: playwright',
        'logDir: ./reports/log',
        'logLevel: error',
        'platforms:',
        "  - os: $($PlatformConfig.os)",
        "    osVersion: `"$($PlatformConfig.osVersion)`""
    )

    if ($PlatformConfig.deviceName) {
        $lines += "    deviceName: `"$($PlatformConfig.deviceName)`""
    }

    $lines += @(
        "    browserName: $($PlatformConfig.browserName)",
        "    browserVersion: $($PlatformConfig.browserVersion)",
        '    playwrightConfigOptions:',
        "      name: $($PlatformConfig.name)"
    )

    return ($lines -join [Environment]::NewLine)
}

function New-FullMatrixYaml {
    return @"
userName: $userName
accessKey: $accessKey
projectName: $projectName
buildName: Local BrowserStack Full Matrix
buildIdentifier: '#local'
framework: playwright
logDir: ./reports/log
logLevel: error
platforms:
  - os: Windows
    osVersion: "11"
    browserName: chrome
    browserVersion: latest
    playwrightConfigOptions:
      name: windows-chrome

  - os: Windows
    osVersion: "10"
    browserName: chrome
    browserVersion: latest
    playwrightConfigOptions:
      name: windows10-chrome

  - os: Windows
    osVersion: "11"
    browserName: edge
    browserVersion: latest
    playwrightConfigOptions:
      name: windows-edge

  - os: Windows
    osVersion: "11"
    browserName: firefox
    browserVersion: latest
    playwrightConfigOptions:
      name: windows-firefox

  - os: OS X
    osVersion: "14"
    browserName: safari
    browserVersion: latest
    playwrightConfigOptions:
      name: macos-safari

  - os: Android
    osVersion: "15"
    deviceName: "Samsung Galaxy S25"
    browserName: chrome
    browserVersion: latest
    playwrightConfigOptions:
      name: samsung-s25-chrome

  - os: Android
    osVersion: "16"
    deviceName: "Google Pixel 10"
    browserName: chrome
    browserVersion: latest
    playwrightConfigOptions:
      name: pixel10-chrome

  - os: Android
    osVersion: "15"
    deviceName: "Google Pixel 9"
    browserName: chrome
    browserVersion: latest
    playwrightConfigOptions:
      name: pixel9-chrome
"@
}

if ($FullMatrix) {
    $yaml = New-FullMatrixYaml
    $selectedTarget = 'full-matrix'
} else {
    $cfg = $platformMap[$Target]
    $yaml = New-BrowserStackYaml -PlatformConfig $cfg
    $selectedTarget = $Target
}

if ($PSCmdlet.ShouldProcess("browserstack.yml", "Write BrowserStack config for $selectedTarget")) {
    Set-Content -Path $bsConfigPath -Value $yaml
    Write-Host "Prepared BrowserStack config for: $selectedTarget"
}

$grepArg = switch ($Suite) {
    'smoke' { @('--grep', '@smoke') }
    'sanity' { @('--grep', '@sanity') }
    'regression' { @('--grep', '@regression') }
    default { $null }
}

$cmdArgs = @(
    'browserstack-node-sdk',
    'playwright',
    'test',
    'tests/orangehrm.spec.js'
)

if ($grepArg) { $cmdArgs += $grepArg }
$cmdArgs += @('--', '--config=playwright.browserstack.config.js')
if (-not $FullMatrix) { $cmdArgs += @("--project=$Target") }

if ($PSCmdlet.ShouldProcess("BrowserStack run", "Run $Suite on $selectedTarget")) {
    Write-Host "Executing: npx $($cmdArgs -join ' ')"
    & npx @cmdArgs
}
