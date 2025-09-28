import React, { useState } from 'react';
import { Table, Card, Button, Modal, Typography, Tag, Input, Space, Descriptions } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Candidate } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;

const InterviewerTab: React.FC = () => {
  const candidates = useSelector((state: RootState) => state.candidates.list);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'descend') {
        return b.score - a.score;
      }
      return a.score - b.score;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Candidate, b: Candidate) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: Candidate, b: Candidate) => a.score - b.score,
      render: (score: number) => (
        <Tag color={getScoreColor(score)}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Candidate, b: Candidate) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Candidate) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => setSelectedCandidate(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3}>Candidates Dashboard</Title>
            <Text type="secondary">Total: {candidates.length}</Text>
          </div>

          <Space>
            <Search
              placeholder="Search by name or email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button 
              onClick={() => setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend')}
            >
              Sort by Score ({sortOrder === 'ascend' ? 'Low to High' : 'High to Low'})
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredCandidates}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>

      <Modal
        title="Candidate Details"
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setSelectedCandidate(null)}>
            Close
          </Button>
        ]}
      >
        {selectedCandidate && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions title="Personal Information" bordered>
              <Descriptions.Item label="Name">{selectedCandidate.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCandidate.phone}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedCandidate.status)}>
                  {selectedCandidate.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Final Score">
                <Tag color={getScoreColor(selectedCandidate.score)}>
                  {selectedCandidate.score}%
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Interview Date">
                {new Date(selectedCandidate.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>



            <Card title={`Interview Responses (${selectedCandidate.answers.length} answered)`} size="small">
              <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
                {selectedCandidate.answers.map((answer, index) => (
                  <div key={answer.questionId} style={{ marginBottom: 24 }}>
                    {/* AI Question */}
                    <div style={{ display: 'flex', marginBottom: 8 }}>
                      <div style={{ 
                        background: '#f0f0f0', 
                        padding: '8px 12px', 
                        borderRadius: '12px 12px 12px 4px',
                        maxWidth: '80%'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <Text strong style={{ fontSize: 12 }}>AI Interviewer</Text>
                          <Tag color={answer.difficulty === 'easy' ? 'green' : answer.difficulty === 'medium' ? 'orange' : 'red'}>
                            {answer.difficulty.toUpperCase()}
                          </Tag>
                        </div>
                        <Text>{answer.question}</Text>
                      </div>
                    </div>
                    
                    {/* Candidate Answer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                      <div style={{ 
                        background: '#1890ff', 
                        color: 'white',
                        padding: '8px 12px', 
                        borderRadius: '12px 12px 4px 12px',
                        maxWidth: '80%'
                      }}>
                        <div style={{ marginBottom: 4 }}>
                          <Text style={{ color: 'white', fontSize: 12, opacity: 0.8 }}>Candidate</Text>
                        </div>
                        <Text style={{ color: 'white' }}>{answer.answer}</Text>
                      </div>
                    </div>
                    
                    {/* Scoring Info */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                      <div style={{ 
                        background: '#fafafa', 
                        padding: '4px 8px', 
                        borderRadius: 8,
                        fontSize: 12
                      }}>
                        <Text type="secondary">
                          Time: {answer.timeSpent}s / {answer.maxTime}s
                        </Text>
                        <span style={{ margin: '0 8px', color: '#d9d9d9' }}>|</span>
                        <Tag color={getScoreColor(answer.score)}>
                          Score: {answer.score}%
                        </Tag>
                      </div>
                    </div>
                  </div>
                ))}
                  
                  {/* Final AI Summary */}
                  {selectedCandidate.summary && (
                    <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: '#52c41a' }}>🤖 AI Final Assessment</Text>
                      </div>
                      <Text>{selectedCandidate.summary}</Text>
                      <div style={{ marginTop: 8, textAlign: 'center' }}>
                        <Tag color={getScoreColor(selectedCandidate.score)} style={{ fontSize: 14, padding: '4px 12px' }}>
                          Final Score: {selectedCandidate.score}%
                        </Tag>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerTab;