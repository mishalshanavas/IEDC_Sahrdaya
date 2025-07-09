const IMGBB_API_KEY = "9d1feb79729a87fe39db0458594adfe2";

export const uploadToImgBB = async (file) => {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API key is not configured');
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Failed to upload image to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    throw error;
  }
}; 