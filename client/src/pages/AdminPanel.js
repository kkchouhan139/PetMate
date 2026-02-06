import React, { useState, useEffect } from 'react';
import { Users, Heart, Flag, BarChart3, Shield, CheckCircle, XCircle } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalMatches: 0,
    pendingReports: 0,
    pendingApprovals: 0
  });
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activity, setActivity] = useState({ recentUsers: [], recentPets: [], recentReports: [], recentMatches: [] });

  useEffect(() => {
    fetchAdminStats();
    fetchPendingUsers();
    fetchReports();
    fetchActivity();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch admin stats');
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await API.get('/admin/users?status=pending');
      setPendingUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch pending users');
    }
  };

  const fetchReports = async () => {
    try {
      const response = await API.get('/admin/reports');
      setReports(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await API.get('/admin/activity');
      setActivity(response.data);
    } catch (error) {
      toast.error('Failed to fetch activity');
    }
  };

  const approveUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/approve`);
      toast.success('User approved');
      fetchAdminStats();
      fetchPendingUsers();
      fetchActivity();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const rejectUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/reject`, { reason: 'Not approved' });
      toast.success('User rejected');
      fetchAdminStats();
      fetchPendingUsers();
      fetchActivity();
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="w-11/12 max-w-6xl mx-auto px-0 sm:px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage PetMate platform</p>
        </div>
      </div>

      <div className="w-11/12 max-w-6xl mx-auto px-0 sm:px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Pets</p>
                <p className="text-3xl font-bold">{stats.totalPets}</p>
              </div>
              <Heart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Matches</p>
                <p className="text-3xl font-bold">{stats.totalMatches}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Reports</p>
                <p className="text-3xl font-bold text-red-600">{stats.pendingReports}</p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['approvals', 'reports', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tab === 'approvals' && `Pending Approvals (${stats.pendingApprovals})`}
              {tab === 'reports' && `Reports (${stats.pendingReports})`}
              {tab === 'activity' && 'Recent Activity'}
            </button>
          ))}
        </div>

        {activeTab === 'approvals' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Pending User Approvals</h3>
            </div>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-500">No pending approvals.</p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map((user) => (
                  <div key={user._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-lg p-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveUser(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Flag className="w-6 h-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Reports</h3>
            </div>
            {reports.length === 0 ? (
              <p className="text-gray-500">No reports.</p>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report._id} className="border rounded-lg p-3">
                    <p className="font-medium capitalize">{report.reason.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Status: {report.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">New Users</h3>
              {activity.recentUsers?.length ? (
                <ul className="space-y-2 text-sm">
                  {activity.recentUsers.map((u) => (
                    <li key={u._id} className="flex justify-between">
                      <span>{u.name}</span>
                      <span className="text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No recent users.</p>}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">New Pets</h3>
              {activity.recentPets?.length ? (
                <ul className="space-y-2 text-sm">
                  {activity.recentPets.map((p) => (
                    <li key={p._id} className="flex justify-between">
                      <span>{p.name}</span>
                      <span className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No recent pets.</p>}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">Recent Reports</h3>
              {activity.recentReports?.length ? (
                <ul className="space-y-2 text-sm">
                  {activity.recentReports.map((r) => (
                    <li key={r._id} className="flex justify-between">
                      <span className="capitalize">{r.reason.replace('_', ' ')}</span>
                      <span className="text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No recent reports.</p>}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3">Recent Matches</h3>
              {activity.recentMatches?.length ? (
                <ul className="space-y-2 text-sm">
                  {activity.recentMatches.map((m) => (
                    <li key={m._id} className="flex justify-between">
                      <span className="capitalize">{m.status}</span>
                      <span className="text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gray-500">No recent matches.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
