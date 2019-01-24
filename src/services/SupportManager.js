export function isWebPSupported () {
  return new Promise((resolve, reject) => {
    const kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA=='
    }
    const img = new window.Image()

    img.onload = function () {
      var result = (img.width > 0) && (img.height > 0)
      resolve(result)
    }
    img.onerror = function () {
      resolve(false)
    }
    img.src = 'data:image/webp;base64,' + kTestImages['lossy']
  })
}
