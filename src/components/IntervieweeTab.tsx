import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'antd';
import { RootState } from '../store/store';
import { addCandidate } from '../store/candidatesSlice';
import { startInterview } from '../store/interviewSlice';
import { Candidate } from '../types';
import ResumeUpload from './ResumeUpload';
import ContactForm from './ContactForm';
import InterviewChat from './InterviewChat';

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const { isActive } = useSelector((state: RootState) => state.interview);
  const candidates = useSelector((state: RootState) => state.candidates.list);
  
  const [step, setStep] = useState<'upload' | 'contact' | 'interview'>('upload');
  const [resumeData, setResumeData] = useState<any>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  React.useEffect(() => {
    // Check for incomplete interviews on load
    const incompleteCandidate = candidates.find(c => c.status === 'in-progress');
    if (incompleteCandidate && !isActive) {
      setCurrentCandidate(incompleteCandidate);
      setShowWelcomeBack(true);
    }
  }, [candidates, isActive]);

  const handleResumeProcessed = (data: any) => {
    setResumeData(data);
    
    // Check if all required fields are present
    if (data.name && data.email && data.phone) {
      handleContactSubmit(data);
    } else {
      setStep('contact');
    }
  };

  const handleContactSubmit = (contactData: any) => {
    const candidate: Candidate = {
      id: Date.now().toString(),
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      resumeText: resumeData?.resumeText || '',
      score: 0,
      summary: '',
      answers: [],
      status: 'in-progress',
      createdAt: new Date().toISOString()
    };

    dispatch(addCandidate(candidate));
    setCurrentCandidate(candidate);
    setStep('interview');
    dispatch(startInterview({ candidateId: candidate.id, timeLimit: 20 })); // Start with first question (easy - 20s)
  };

  const handleResumeInterview = () => {
    if (currentCandidate) {
      setStep('interview');
      const nextQuestionIndex = currentCandidate.answers.length;
      const timeLimit = nextQuestionIndex < 2 ? 20 : nextQuestionIndex < 4 ? 60 : 120;
      dispatch(startInterview({ candidateId: currentCandidate.id, timeLimit }));
    }
    setShowWelcomeBack(false);
  };

  const handleStartFresh = () => {
    setCurrentCandidate(null);
    setStep('upload');
    setResumeData(null);
    setShowWelcomeBack(false);
  };

  if (step === 'interview' && currentCandidate) {
    return <InterviewChat candidate={currentCandidate} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Modal
        title="Welcome Back!"
        open={showWelcomeBack}
        footer={[
          <Button key="fresh" onClick={handleStartFresh}>
            Start Fresh Interview
          </Button>,
          <Button key="resume" type="primary" onClick={handleResumeInterview}>
            Resume Previous Interview
          </Button>
        ]}
        closable={false}
      >
        <p>You have an incomplete interview. Would you like to resume where you left off or start a new interview?</p>
        {currentCandidate && (
          <p><strong>Previous candidate:</strong> {currentCandidate.name}</p>
        )}
      </Modal>

      {step === 'upload' && (
        <ResumeUpload onResumeProcessed={handleResumeProcessed} />
      )}

      {step === 'contact' && resumeData && (
        <ContactForm
          initialData={resumeData}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
};

export default IntervieweeTab;