import AWS from 'aws-sdk';

AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

export const generatePreSignedUrl = (fileName) => {
    const params = {
      Bucket: "claimantdataportal",
      Key: fileName, // Name of the file in S3
      Expires: 60 * 60 * 24 * 7, // 3 days in seconds
    };
  
    const url = s3.getSignedUrl('getObject', params);
    return url;
}

export const uploadFilesToS3 = async (filesArr, matterNumber, setResponse) => {
    console.log(matterNumber)
    const uploadedPromises = filesArr.map(prettyFile => {
        let { file } = prettyFile;

        const fileName = `${matterNumber}/${file.name}`

        const params = {
            Bucket: "claimantdataportal",
            Key: fileName,
            Body: file,
            ContentType: file.type,
        };

        const determinePlural = `File${filesArr.length > 1 ? "s" : ""}`

        // Upload the file
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error(`Error uploading ${determinePlural}:`, err);
                    setResponse(`Error uploading ${determinePlural}:`, err);
                    reject(err)
                } else {
                    console.log(`${determinePlural} uploaded successfully:`, data);
                    setResponse(`${determinePlural} uploaded successfully`);

                    const url = generatePreSignedUrl(fileName);
                    resolve(url)
                }
            });
        })
    })

    return Promise.all(uploadedPromises)
}

// import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// // Initialize the S3 client with the necessary configuration
// const s3Client = new S3Client({
//   region: process.env.REACT_APP_AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Generate a pre-signed URL
// export const generatePreSignedUrl = async (fileName) => {
//   const command = new GetObjectCommand({
//     Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
//     Key: fileName,
//   });

//   try {
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 }); // 7 days in seconds
//     return url;
//   } catch (error) {
//     console.error("Error generating pre-signed URL:", error);
//     throw error;
//   }
// };

// // Upload files to S3
// export const uploadFilesToS3 = async (filesArr, matterNumber, setResponse) => {
//   const uploadPromises = filesArr.map(async (prettyFile) => {
//     const { file } = prettyFile;
//     const fileName = `${matterNumber}/${file.name}`;

//     const command = new PutObjectCommand({
//       Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
//       Key: fileName,
//       Body: file,
//       ContentType: file.type,
//     });

//     const responseSuffix = filesArr.length > 1 ? "Files" : "File";

//     try {
//       const data = await s3Client.send(command);
//       console.log(`${responseSuffix} uploaded successfully:`, data);
//       setResponse(`${responseSuffix} uploaded successfully`);

//       const url = await generatePreSignedUrl(fileName);
//       return url;
//     } catch (err) {
//       console.error(`Error uploading ${responseSuffix}:`, err);
//       setResponse(`Error uploading ${responseSuffix}: ${err.message}`);
//       throw err;
//     }
//   });

//   return Promise.all(uploadPromises);
// };



