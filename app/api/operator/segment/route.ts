/* eslint-disable @typescript-eslint/no-explicit-any */
// import { spawn } from 'child_process';
// import path from 'path';
// import { NextRequest, NextResponse } from 'next/server';
// import { promises as fs } from 'fs';

// type ResponseData = {
//   segmentedImageUrl?: string;
//   error?: string;
// };

// // Use 'python' instead of 'python3' for Windows compatibility
// const PYTHON_EXECUTABLE = process.platform === 'win32' ? 'python' : 'python3';

// export async function POST(req: NextRequest): Promise<NextResponse<ResponseData>> {
//   try {
//     // Get the form data from the request
//     const formData = await req.formData();
//     const file = formData.get('image') as File | null;

//     if (!file) {
//       return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
//     }

//     // Convert the File to a temporary file on disk
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const tempFilePath = path.join(process.cwd(), 'tmp', `${Date.now()}-${file.name}`);
//     await fs.mkdir(path.dirname(tempFilePath), { recursive: true }); // Ensure tmp directory exists
//     await fs.writeFile(tempFilePath, buffer);

//     const outputImagePath = path.join(process.cwd(), 'public', 'segmented_output.jpg');

//     // Run the Python script
//     const pythonProcess = spawn(PYTHON_EXECUTABLE, [
//       path.join(process.cwd(), 'yoloTest.py'),
//       tempFilePath,
//       outputImagePath,
//     ]);

//     let errorOutput = '';
//     pythonProcess.stderr.on('data', (data: Buffer) => {
//       errorOutput += data.toString();
//     });

//     await new Promise<void>((resolve, reject) => {
//       pythonProcess.on('close', (code) => {
//         if (code === 0) resolve();
//         else reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
//       });
//     });

//     // Clean up temporary file
//     await fs.unlink(tempFilePath);

//     // Return the URL of the segmented image
//     return NextResponse.json({ segmentedImageUrl: '/segmented_output.jpg' });
//   } catch (error) {
//     console.error('Segmentation error:', error);
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : 'Failed to segment image',
//       },
//       { status: 500 }
//     );
//   }
// } 

// app/api/operator/segment/route.ts
import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
  segmentedImageUrl?: string;
  error?: string;
};

export async function POST(req: NextRequest): Promise<NextResponse<ResponseData>> {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 });
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString('base64');

    // Construct the URL for the Python API
    // In production this will be the same domain, in development you'll need to adjust this
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? `${process.env.VERCEL_URL || ''}/api/segment` 
      : 'http://localhost:3000/api/segment';

    console.log(`Calling Python API at: ${apiUrl}`);

    // Call the Python serverless function
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Return the processed image
    return NextResponse.json({
      segmentedImageUrl: `data:image/jpeg;base64,${data.segmentedImage}`
    }, { status: 200 });
    
  } catch (error) {
    console.error('Segmentation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to segment image' },
      { status: 500 }
    );
  }
}