# SkyRelief Connect Platform (Cyclone Disaster Platform)

A comprehensive, real-time emergency response and disaster management application designed to facilitate rapid communication, resource allocation, and SOS handling during critical situations such as cyclones and severe weather events. 

Built with network resilience in mind, this platform ensures that users can request help, find shelters, and access vital information even in scenarios with degraded connectivity.

## What This Project Does

The core objective of the platform is to bridge the gap between people in distress and emergency responders. It provides a centralized hub for:

- **Emergency SOS Management:** Users can submit real-time SOS requests that are instantly logged and displayed in a central alert interface.
- **Relief Camp Locator:** Helps users locate nearby relief camps and safe shelters quickly.
- **Real-Time Disaster Alerts:** Surfaces live updates, weather warnings, and critical advisories.
- **Voice-Activated Assistance:** Features built-in speech recognition (powered by browser APIs and ElevenLabs) allowing users to trigger emergency actions hands-free by saying keywords like "help", "sos", or "find camp".
- **AI Chatbot Support:** Provides automated guidance and rapid answers to emergency-related queries.
- **Network-Resilient Architecture:** Designed with offline capabilities and local-first data caching to ensure functionality when traditional internet infrastructure is compromised (e.g., integrating with HAPS networks).

## How It Works

### Tech Stack

- **Frontend:** Built with [Next.js](https://nextjs.org/) and React, providing a fast, responsive, and accessible user interface.
- **Styling:** Styled using [Tailwind CSS](https://tailwindcss.com/) and Radix UI components for a robust and modern design system.
- **Backend & Database:** Integrated with **Firebase Firestore** to handle real-time data persistence, ensuring that user-submitted alerts and SOS requests are synced instantly across the network.
- **Voice & AI:** Uses ElevenLabs and web speech APIs to process spoken commands and provide text-to-speech emergency announcements.

### Application Flow

1. **User Distress Signal:** A user in an affected area opens the app (or uses a voice command) to submit an Emergency SOS form.
2. **Data Synchronization:** The SOS data is validated and securely written to Firebase Firestore.
3. **Responder Visibility:** The newly created alert immediately appears in the `AlertsSection` for emergency responders and platform administrators to triage.
4. **Continuous Guidance:** Meanwhile, the user can interact with the AI Chatbot or use the Camp Locator to navigate to the nearest safe zone based on their offline/online cached data.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up your Firebase credentials and other environment variables in a `.env.local` file.

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
