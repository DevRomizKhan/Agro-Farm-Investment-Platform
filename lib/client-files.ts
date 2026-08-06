/**
 * Prepare a photo selected from a camera before it is sent through a Server
 * Action. Phone cameras often produce very large images and may report a
 * vendor-specific MIME type. Re-encoding browser-decodable images gives the
 * server a predictable format and keeps the complete KYC request small.
 */
export async function prepareImageFile(file: File, maxDimension = 4096): Promise<File> {
  if (!isSupportedImageFile(file) || typeof document === 'undefined') return file

  try {
    const source = await loadImageSource(file)
    const scale = Math.min(1, maxDimension / Math.max(source.width, source.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(source.width * scale))
    canvas.height = Math.max(1, Math.round(source.height * scale))

    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    if ('close' in source && typeof source.close === 'function') source.close()

    const blob = await canvasToJpeg(canvas)
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'camera-image'
    return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    // Browsers that cannot decode HEIC/HEIF should still be allowed to send
    // the original file; the server validates it by its image MIME type.
    return file
  }
}

async function loadImageSource(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file, { imageOrientation: 'from-image' })
  }

  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))), 'image/jpeg', 0.88)
  })
}

export function isSupportedImageFile(file: File): boolean {
  if (file.type.startsWith('image/')) return true
  return /\.(avif|heic|heif|jpeg|jpg|png|webp)$/i.test(file.name)
}
