import React from 'react';
import { Layout, Tabs } from 'antd';
import { UserOutlined, DashboardOutlined } from '@ant-design/icons';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee
        </span>
      ),
      children: <IntervieweeTab />,
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <DashboardOutlined />
          Interviewer Dashboard
        </span>
      ),
      children: <InterviewerTab />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>
          AI Interview Assistant
        </h1>
      </Header>
      
      <Content style={{ background: '#f5f5f5' }}>
        <Tabs
          defaultActiveKey="interviewee"
          items={tabItems}
          size="large"
          style={{ 
            background: '#fff',
            minHeight: 'calc(100vh - 64px)'
          }}
        />
      </Content>
    </Layout>
  );
};

export default App;