# Project Details: BinIt AI Waste Classifier

This document outlines the architecture, features, and specifications of the **BinIt AI Waste Classifier**, an application focused on waste management and sustainability education.

## Overview
BinIt is an AI-powered waste classification application designed to help users identify and correctly dispose of waste in India, adhering to BBMP (Bengaluru) guidelines. It leverages Google's Gemini API for image and text-based waste analysis.

## Key Features
- **AI Classification**: Uses `gemini-2.5-flash` (with fallbacks to `gemini-2.5-flash-lite` and `gemini-1.5-flash`) to categorize waste based on user-provided images or text descriptions.
- **Multi-lingual Support**: Full support for English, Hindi (hi), and Kannada (kn) to ensure broad regional accessibility.
- **Two-Step Workflow**:
  1. **Identify Waste**: Users upload a photo or type a description to find out if the item belongs in Wet, Dry, Hazardous, or E-Waste bins. It provides an "Impact Score", reasoning, and actionable links to local Indian NGOs.
  2. **Audit Dustbin**: Users upload a picture of their dustbin. The AI acts as a safety auditor to determine if the item is safe to be disposed of there, preventing toxic/e-waste from entering unsegregated bins.
- **Custom API Setup**: Users provide their own Google AI Studio API key, which is stored securely in local storage.
- **UI/UX Aesthetics**: Features a modern, mobile-responsive dark theme with a glassmorphic card design, gradient backgrounds, and smooth micro-animations.

## Technical Stack
- React (`useState`, `useRef`)
- Google Gemini REST API (`fetch` to Generative Language API)
- Vanilla CSS injected via `<style>` for keyframe animations (fadeUp, spin, pulse, glow)
- HTML5 Canvas & FileReader for client-side image processing.
