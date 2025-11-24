import React, { useState } from 'react';
import { Search, MoreVertical, UserCheck, UserX, ShieldCheck, Filter } from 'lucide-react';
import { MOCK_USERS } from '../constants';

const UserDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_USERS.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-3xl font-bold text-white">User Directory</h2>
          <p className="text-gray-400 text-sm mt-1">View and manage all registered creators.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black border border-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none w-64"
            />
          </div>
          <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors border border-gray-700">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-8 overflow-x-auto flex-1">
        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Creator</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.displayName}</div>
                        <div className="text-xs text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joinedDate}</td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <UserCheck size={12} />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <UserX size={12} />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.plan === 'pro' ? (
                       <span className="inline-flex items-center space-x-1 text-xs font-bold text-purple-400">
                         <ShieldCheck size={14} />
                         <span>PRO</span>
                       </span>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">Free</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors rounded hover:bg-gray-800">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right text-xs text-gray-600">
           Showing {filteredUsers.length} users
        </div>
      </div>
    </div>
  );
};

export default UserDirectory;