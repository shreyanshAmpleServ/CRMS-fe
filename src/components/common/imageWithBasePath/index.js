import React from 'react';
import { img_path } from '../../../config/environment'; // Ensure this is correctly set in your environment configuration

const ImageWithBasePath = ({
  className = '', // Default value for className
  src = '', // Default value for src to handle missing props
  alt = '', // Default value for alt to avoid warnings
  height, // Optional height
  width, // Optional width
  id, // Optional id
  style
}) => {
  // Validate if src is provided
  if (!src) {
    console.error('The "src" prop is required for ImageWithBasePath.');
    return null; // Return null to prevent rendering broken images
  }

  // Combine the base path and the provided src to create the full image source URL
  const fullSrc = `${img_path}/${src}`.replace(/\/{2,}/g, '/'); // Normalize double slashes

  return (
    <img
      className={className}
      src={fullSrc}
      height={height}
      alt={alt}
      width={width}
      id={id}
      style={style}

    />
  );
};

export default ImageWithBasePath;
