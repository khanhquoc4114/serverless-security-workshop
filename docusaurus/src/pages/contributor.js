import React from 'react';
import Layout from '@theme/Layout';

export default function Contributors() {
  const contributors = [
    {
      name: 'Phạm Nguyễn Hải Anh',
      role: 'Cloud Consultant',
      avatar: 'https://media.licdn.com/dms/image/v2/D5603AQG515A1K31YaA/profile-displayphoto-crop_800_800/B56ZiUmPlwHQAM-/0/1754839711154?e=1771459200&v=beta&t=fywxsgztFIDB22zEUdmdQRUTb8DW5yi91t1tueVuyoM',
    },
    {
      name: 'Nguyễn Đặng Khánh Quốc',
      role: 'Cloud Engineer',
      avatar: 'https://avatars.githubusercontent.com/u/90808109?v=4',
    },
  ];

  return (
    <Layout title="Contributors" description="Workshop Contributors">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          minHeight: '50vh',
        }}>
        <h1 style={{ marginBottom: '2rem' }}>Workshop Contributors</h1>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #FF9900' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Avatar</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((contributor, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #ddd',
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  }}>
                  <td style={{ padding: '1rem' }}>
                    <img
                      src={contributor.avatar}
                      alt={contributor.name}
                      style={{ borderRadius: '50%', width: '60px', height: '60px' }}
                    />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    {contributor.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#666' }}>
                    {contributor.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}