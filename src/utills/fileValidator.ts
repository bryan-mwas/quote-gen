/**
 * Validates if an image file is within the specified size limit
 * @param {File|Blob} file - The file to validate
 * @param {number} [maxSizeKB=200] - Maximum allowed size in kilobytes (default: 200KB)
 * @returns {Promise<{isValid: boolean, message: string, fileSize: number, imageInfo: {width: number, height: number, type: string} | null}>}
 */
async function validateImageFileSize(file?: File, maxSizeKB = 200) {
  try {
    // Input validation
    if (!file) {
      throw new Error("No file provided");
    }

    // Check if file is an image
    const validImageTypes = ["image/jpeg", "image/png"];
    const isImageFile = validImageTypes.includes(file.type);

    if (!isImageFile) {
      throw new Error(
        "Invalid file type. Only JPEG and PNG files are allowed."
      );
    }

    // Get file size in KB
    const fileSizeKB = file.size / 1024;

    // Prepare response object
    const response = {
      isValid: false,
      message: "",
      fileSize: Number(fileSizeKB.toFixed(2)),
    };

    // Check if file size is within limit
    if (fileSizeKB <= maxSizeKB) {
      response.isValid = true;
      response.message = `Image size (${response.fileSize}KB) is within the limit of ${maxSizeKB}KB`;
    } else {
      response.message = `Image size (${response.fileSize}KB) exceeds the limit of ${maxSizeKB}KB`;
    }

    return response;
  } catch (error) {
    return {
      isValid: false,
      message: (error as Error).message,
      fileSize: 0,
      imageInfo: null,
    };
  }
}

// Export the functions
export { validateImageFileSize };
