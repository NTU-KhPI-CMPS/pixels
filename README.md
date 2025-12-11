# Pixels

Pixels is a tool designed for the quantitative analysis of microscopic metal images.
It processes images to detect, measure, and analyze surface features, allowing for the assessment of damage coverage and anisotropy.

## Core Functionality
The application employs an image processing pipeline to extract meaningful data from raw microscopic imagery. The analysis process involves several key stages:

### 1. Adaptive Binarization
The first step involves converting the input image into a binary format (black and white) to separate features of interest from the background.
This is achieved using **adaptive thresholding**, which calculates the threshold for a small region around each pixel.
This method is robust against varying lighting conditions across the image.

### 2. Edge Detection
Once binarized, the system identifies the boundaries of the features.
It utilizes the **Canny edge detector** to find edges, followed by morphological operations (closing) to ensure the detected shapes are continuous and free of small noise.

### 3. Contour Analysis
From the detected edges, the system extracts contours. These contours represent the individual features on the metal surface.
The system filters these contours based on their area, allowing users to focus on features within a specific size range (min/max area) and ignore irrelevant artifacts.

### 4. Feature Statistics & Anisotropy
For every valid contour, the system calculates detailed geometric statistics:
- **Area & Perimeter:** Basic size measurements.
- **Coverage:** The total percentage of the image surface covered by the detected features.
- **Orientation:** By fitting rotated rectangles to the contours, the system determines the angle and orientation of each feature.
- **Aspect Ratio:** The ratio between the longest and shortest sides of the fitted rectangle, useful for analyzing the elongation of features.

These metrics are aggregated to provide a comprehensive statistical overview, including average area/perimeter, total coverage, and average directional alignment (anisotropy).

## Technology
The core image processing logic is powered by **OpenCV.js**, a WebAssembly binding for the OpenCV library.
This allows for computer vision algorithms to run directly in the browser environment.
