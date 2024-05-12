import axios from 'axios'

export const uploadImageToCloudinary = async (uri) => {
  const formData = new FormData()
  const filename = uri.split('/').pop()

  formData.append('file', {
    uri,
    name: filename,
    type: `image/${filename.split('.').pop()}`
  })
  formData.append('upload_preset', 'upload')

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dkl9cqqui/image/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data.url
  } catch (error) {
    console.log(error)
    return null
  }
}
