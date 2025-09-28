import React, { useState } from 'react';
import { Upload, Button, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { extractTextFromFile, extractContactInfo } from '../utils/fileProcessor';

interface ResumeUploadProps {
  onResumeProcessed: (data: { name: string; email: string; phone: string; resumeText: string }) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeProcessed }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const resumeText = await extractTextFromFile(file);
      const contactInfo = extractContactInfo(resumeText);
      
      onResumeProcessed({
        ...contactInfo,
        resumeText
      });
      
      const extractedFields = [];
      if (contactInfo.name) extractedFields.push('Name');
      if (contactInfo.email) extractedFields.push('Email');
      if (contactInfo.phone) extractedFields.push('Phone');
      
      if (extractedFields.length > 0) {
        message.success(`Resume processed! Extracted: ${extractedFields.join(', ')}`);
      } else {
        message.warning('Resume uploaded but no contact info found. Please fill manually.');
      }
    } catch (error) {
      message.error('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload
  };

  return (
    <Card title="Upload Your Resume" style={{ maxWidth: 500, margin: '0 auto' }}>
      <Upload
        accept=".pdf,.docx"
        beforeUpload={handleFileUpload}
        showUploadList={false}
        disabled={loading}
      >
        <Button 
          icon={<UploadOutlined />} 
          loading={loading}
          size="large"
          type="primary"
        >
          {loading ? 'Processing...' : 'Upload Resume (PDF/DOCX)'}
        </Button>
      </Upload>
      <p style={{ marginTop: 16, color: '#666' }}>
        Please upload your resume in PDF or DOCX format. We'll extract your contact information automatically.
      </p>
    </Card>
  );
};

export default ResumeUpload;