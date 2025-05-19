import React from 'react';
import { img_path } from '../../../config/environment'; // Ensure this is correctly set in your environment configuration
import { IoMdPerson } from "react-icons/io";

const ImageWithDatabase = ({
  className = '', // Default value for className
  src = '', // Default value for src to handle missing props
  alt = '', // Default value for alt to avoid warnings
  height, // Optional height
  width, // Optional width
  id, // Optional id
}) => {
  // Validate if src is provided
  if (!src) {
    console.error('The "src" prop is required for ImageWithBasePath.');
    return null; // Return null to prevent rendering broken images
  }

  // Combine the base path and the provided src to create the full image source URL
//   const fullSrc = `${img_path}/${src}`.replace(/\/{2,}/g, '/'); // Normalize double slashes

  return (<>
   {src ?  <img
      className={`border bg-gray-100 img-fluid ${className}`}
      src={src}
      height={height}
      alt={alt}
      width={width}
      id={id}

    />  : <div className={"border bg-secondary"}> <IoMdPerson /></div>}
    
    </>);
};

export default ImageWithDatabase;
