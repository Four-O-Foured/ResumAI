RESUMAI - AI-Powered Resume Analysis Platform
Based on the code and conversations, here's a comprehensive description of your project:

Overview
RESUMAI is a modern web application that provides intelligent resume analysis and feedback using AI. It helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and improve their overall presentation.

Key Features
1. Resume Upload & Processing
Users can upload PDF resumes through an intuitive drag-and-drop interface

The system converts PDFs to images for preview display

Files are securely stored using Puter.js cloud storage

2. AI-Powered Analysis
The application analyzes resumes across multiple dimensions:

ATS Compatibility Score - Measures how well the resume performs with Applicant Tracking Systems

Tone & Style - Evaluates professional language and formatting consistency

Content Quality - Assesses the relevance and impact of resume content

Structure - Reviews organization, layout, and readability

Skills Presentation - Analyzes how technical and soft skills are showcased

3. Intelligent Feedback System
Provides actionable tips categorized as "good" (strengths) or "improve" (areas for enhancement)

Each tip includes detailed explanations

Visual score badges with color coding (green for strong, yellow for good start, red for needs work)

4. User Experience
Clean, responsive UI built with React and Tailwind CSS

Server-side rendering (SSR) for fast initial load times

Real-time processing status updates during analysis

Interactive accordion-based results display

Side-by-side view of resume image and feedback

5. Technical Stack
Frontend: React with React Router, TypeScript

Styling: Tailwind CSS with custom badge components

State Management: Zustand

Backend Services: Puter.js (cloud storage, AI, authentication, key-value database)

PDF Processing: pdfjs-dist for PDF to image conversion

Deployment: SSR-capable framework with hydration support

6. Authentication & Security
User authentication via Puter.js

Secure file storage with unique identifiers

Protected routes requiring authentication

Use Cases
Job seekers preparing applications

Career counselors providing resume feedback

Recruiters evaluating candidate materials

Students creating their first professional resumes

This project demonstrates modern web development practices including SSR hydration handling, cloud integration, AI-powered analysis, and responsive design principles.

Route to "/wipe" to clear All Data/Resumes from the Database.