# Paths
$projectDir = "C:\Users\dhruv\.gemini\antigravity\scratch\surat-dental-clinic"
$htmlPath = "$projectDir\index.html"
$cssPath = "$projectDir\styles.css"
$jsPath = "$projectDir\script.js"

# Read CSS and JS contents
$cssContent = Get-Content -Raw -Path $cssPath
$jsContent = Get-Content -Raw -Path $jsPath

# Base64 encode images
$heroBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$projectDir\images\hero.png"))
$doctorBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$projectDir\images\doctor.png"))
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$projectDir\images\logo.png"))
$teethBeforeBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$projectDir\images\teeth-before.png"))
$teethAfterBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$projectDir\images\teeth-after.png"))

# Read HTML content
$htmlContent = Get-Content -Raw -Path $htmlPath

# Replace stylesheet link with inline styles
$cssRegex = '(?i)<link\s+rel="stylesheet"\s+href="styles.css"\s*\/?>'
$styleTag = "<style>`n$cssContent`n</style>"
$htmlContent = [regex]::Replace($htmlContent, $cssRegex, $styleTag)

# Replace script src with inline script
$jsRegex = '(?i)<script\s+src="script.js"\s*><\/script>'
$scriptTag = "<script>`n$jsContent`n</script>"
$htmlContent = [regex]::Replace($htmlContent, $jsRegex, $scriptTag)

# Replace image paths with base64 data URIs
$htmlContent = $htmlContent.Replace('src="images/hero.png"', "src=`"data:image/png;base64,$heroBase64`"")
$htmlContent = $htmlContent.Replace('src="images/doctor.png"', "src=`"data:image/png;base64,$doctorBase64`"")
$htmlContent = $htmlContent.Replace('src="images/logo.png"', "src=`"data:image/png;base64,$logoBase64`"")
$htmlContent = $htmlContent.Replace('src="images/teeth-before.png"', "src=`"data:image/png;base64,$teethBeforeBase64`"")
$htmlContent = $htmlContent.Replace('src="images/teeth-after.png"', "src=`"data:image/png;base64,$teethAfterBase64`"")

# Save as standalone html file
$outputPath = "$projectDir\surat-dental-clinic-presentation.html"
Set-Content -Path $outputPath -Value $htmlContent -Encoding utf8

Write-Output "Successfully packaged standalone HTML to $outputPath"
