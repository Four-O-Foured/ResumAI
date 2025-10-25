
export const formatSize = (bytes: number) : string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    if (bytes === 0) return "n/a"
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i]
}