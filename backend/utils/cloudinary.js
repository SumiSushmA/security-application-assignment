// backend/utils/cloudinary.js
import dotenv from 'dotenv';
// Load environment variables from .env
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import AppError from './AppError.js';

// Trim and normalize Cloudinary credentials
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim().toLowerCase();
const API_KEY    = process.env.CLOUDINARY_API_KEY?.trim();
const API_SECRET = process.env.CLOUDINARY_API_SECRET?.trim();

// Ensure credentials are present
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  throw new Error(
    'Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key:    API_KEY,
  api_secret: API_SECRET,
});

/**
 * Uploads a local file to Cloudinary, then deletes it locally.
 * @param {string} filePath - Path to the local file
 * @returns {{ url: string, public_id: string }}
 */
export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) return null;
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'quizu',
    });
    fs.unlinkSync(filePath);
    return { url: res.secure_url, public_id: res.public_id };
  } catch (err) {
    // Clean up file on error
    fs.unlinkSync(filePath);
    throw new AppError('Failed to upload avatar to Cloudinary', 500);
  }
};

/**
 * Deletes an image from Cloudinary.
 * @param {string} publicId - The full public_id returned by the upload (including folder)
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  // Ensure folder prefix for publicId
  const fullPublicId = publicId.includes('/') ? publicId : `quizu/${publicId}`;
  try {
    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: 'image',
    });
    return result;
  } catch (err) {
    throw new AppError(`Failed to delete avatar from Cloudinary: ${err.message}`, 500);
  }
};
