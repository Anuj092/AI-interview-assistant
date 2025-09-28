import React from 'react';
import { Form, Input, Button, Card } from 'antd';

interface ContactFormProps {
  initialData: { name: string; email: string; phone: string };
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const missingFields = [];
  if (!initialData.name) missingFields.push('Name');
  if (!initialData.email) missingFields.push('Email');
  if (!initialData.phone) missingFields.push('Phone');

  return (
    <Card 
      title="Complete Your Information" 
      style={{ maxWidth: 500, margin: '0 auto' }}
    >
      {(initialData.name || initialData.email || initialData.phone) && (
        <div style={{ marginBottom: 16, padding: 12, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
          <p style={{ margin: 0, color: '#52c41a', fontWeight: 'bold' }}>✓ Extracted from Resume:</p>
          {initialData.name && <p style={{ margin: '4px 0', color: '#666' }}>Name: {initialData.name}</p>}
          {initialData.email && <p style={{ margin: '4px 0', color: '#666' }}>Email: {initialData.email}</p>}
          {initialData.phone && <p style={{ margin: '4px 0', color: '#666' }}>Phone: {initialData.phone}</p>}
        </div>
      )}
      
      <p style={{ marginBottom: 24, color: '#666' }}>
        {missingFields.length > 0 
          ? `Please provide your ${missingFields.join(', ')} to continue with the interview.`
          : 'Please confirm your information before starting the interview.'
        }
      </p>
      
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Start Interview
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContactForm;