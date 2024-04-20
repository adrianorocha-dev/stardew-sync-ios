interface File {
  name: string;
  uri: string;
  type: string;
}

interface PresignedPost {
  url: string;
  fields: Record<string, string>;
}

export async function uploadFileToS3(file: File, presignedPost: PresignedPost) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(presignedPost.fields)) {
    formData.append(key, value);
  }

  //@ts-expect-error React Native FormData has a different type
  formData.append("file", file);

  console.log("sending file to s3");
  try {
    const response = await fetch(presignedPost.url, {
      method: "POST",
      body: formData,
    });

    console.log("response status:", response.status);

    if (!response.ok) {
      console.log(await response.text());
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    console.log("erro:", JSON.stringify(error, null, 2));
  }
}
