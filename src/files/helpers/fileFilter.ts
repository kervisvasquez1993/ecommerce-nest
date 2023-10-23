

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    console.log({ file })
    if (!file) return callback(new Error("File is empty"), false);
    const fileExptension = file.mimetype.split("/")[1];
    const validExptension = ["jpg", "png", "png", "gif", "jpeg"]
    if (validExptension.includes(fileExptension)) {
        return callback(null, true)
    }

    return callback(null, false)

}