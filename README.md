# AI-Powered Interview Assistant

A React-based interview assistant application that provides an AI-powered interview experience for candidates and a comprehensive dashboard for interviewers.

## Features

### Interviewee Tab (Chat Interface)
- **Resume Upload**: Support for PDF and DOCX files with automatic text extraction
- **Contact Information Extraction**: Automatically extracts name, email, and phone from resume
- **Missing Information Collection**: Prompts candidates to provide missing contact details
- **Timed Interview**: 6 questions with difficulty-based time limits
  - Easy: 2 questions (20 seconds each)
  - Medium: 2 questions (60 seconds each)  
  - Hard: 2 questions (120 seconds each)
- **Auto-submission**: Automatically submits answers when time expires
- **Progress Tracking**: Visual progress indicators and question counters

### Interviewer Dashboard
- **Candidate List**: View all candidates with scores and status
- **Search & Sort**: Filter candidates by name/email and sort by score
- **Detailed View**: Complete interview history, responses, and AI scoring
- **Status Tracking**: Monitor pending, in-progress, and completed interviews

### Data Persistence
- **Local Storage**: All data persists across browser sessions
- **Resume Support**: Welcome back modal for incomplete interviews
- **State Management**: Redux with Redux Persist for reliable data storage

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Ant Design
- **File Processing**: Mammoth (DOCX), PDF parsing
- **Build Tool**: Create React App

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interview-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For Candidates (Interviewee Tab)
1. Upload your resume (PDF or DOCX format)
2. Complete any missing contact information
3. Answer 6 interview questions within the time limits
4. Receive your final score and AI-generated summary

### For Interviewers (Dashboard Tab)
1. View list of all candidates with scores
2. Search and sort candidates as needed
3. Click "View Details" to see complete interview history
4. Review AI scoring and candidate summaries

## Project Structure

```
src/
├── components/          # React components
│   ├── ResumeUpload.tsx
│   ├── ContactForm.tsx
│   ├── InterviewChat.tsx
│   ├── IntervieweeTab.tsx
│   └── InterviewerTab.tsx
├── store/              # Redux store and slices
│   ├── store.ts
│   ├── candidatesSlice.ts
│   └── interviewSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── fileProcessor.ts
│   └── aiService.ts
└── App.tsx             # Main application component
```

## Key Features Implementation

### Resume Processing
- Supports PDF and DOCX file formats
- Extracts text content using appropriate libraries
- Uses regex patterns to identify name, email, and phone number
- Handles missing information gracefully

### Interview Flow
- Dynamic question generation based on difficulty
- Real-time countdown timers with visual progress
- Automatic answer submission on timeout
- AI-powered scoring system (mock implementation)

### Data Persistence
- Redux Persist for automatic state saving
- Survives browser refresh and closure
- Welcome back modal for incomplete sessions
- Complete interview history retention

### Responsive Design
- Clean, modern UI using Ant Design components
- Mobile-friendly responsive layout
- Intuitive navigation between tabs
- Professional interview experience

## Future Enhancements

- Integration with real AI APIs (OpenAI, Claude, etc.)
- Advanced PDF parsing with better text extraction
- Video/audio recording capabilities
- Export functionality for interview reports
- Advanced analytics and reporting
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.