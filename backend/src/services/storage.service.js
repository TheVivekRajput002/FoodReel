const ImageKit = require('imagekit');
const fs = require("fs/promises")
const path = require("path")
const { execFile } = require("child_process")
const { promisify } = require("util")

const execFileAsync = promisify(execFile)

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const tempDirectory = path.join(process.cwd(), "tmp")

async function uploadFile(file, fileName) {
    const result = await imagekit.upload({
        file: file,
        fileName: fileName,
    })

    return result;
}

async function createVideoThumbnail(fileBuffer, fileName, options = {}) {
    const { startOffset = 1, width = 400, height = 400 } = options
    const sourcePath = path.join(tempDirectory, `${fileName}.mp4`)
    const thumbnailPath = path.join(tempDirectory, `${fileName}.jpg`)

    await fs.mkdir(tempDirectory, { recursive: true })
    await fs.writeFile(sourcePath, fileBuffer)

    try {
        await execFileAsync("ffmpeg", [
            "-y",
            "-ss",
            String(startOffset),
            "-i",
            sourcePath,
            "-frames:v",
            "1",
            "-vf",
            `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`,
            thumbnailPath,
        ])

        return await fs.readFile(thumbnailPath)
    } finally {
        await Promise.allSettled([
            fs.unlink(sourcePath),
            fs.unlink(thumbnailPath),
        ])
    }
}


module.exports = {
    uploadFile,
    createVideoThumbnail
}
