import cloudinary from "./Cloudinary"

export const UploadImage = async (file: File, folder:string) => {

    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer)

    return new Promise( async (resolve, reject) => {
        await cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: folder
        }, async (error, result) => {
            if(error) reject(error.message);
            resolve(result)
        }).end(bytes)
    })
}