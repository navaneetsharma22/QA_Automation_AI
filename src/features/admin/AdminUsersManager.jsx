import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Shield, Mail, Lock, User, Users, Edit, Trash2, Ban, CheckCircle2, XCircle, LayoutDashboard } from 'lucide-react';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analyze', label: 'Analyze Chat' },
  { id: 'history', label: 'Analysis History' },
  { id: 'reports', label: 'Reports' },
  { id: 'prompts', label: 'Prompt Management' },
  { id: 'knowledge', label: 'Knowledge Base' },
  { id: 'models', label: 'AI Models' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' }
];

export const AdminUsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sidebarAccess, setSidebarAccess] = useState(AVAILABLE_MODULES.map(m => m.id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSidebarAccess, setEditSidebarAccess] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/v1/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, sidebarAccess })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast.success('User account created successfully!');
      
      // Reset form
      setFullName('');
      setEmail('');
      setPassword('');
      setSidebarAccess(AVAILABLE_MODULES.map(m => m.id));
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUserId(user.id);
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPassword('');
    setEditSidebarAccess(user.sidebarAccess || AVAILABLE_MODULES.map(m => m.id));
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editFullName || !editEmail) {
      toast.error('Name and Email are required');
      return;
    }

    try {
      setIsUpdating(true);
      const res = await fetch(`http://localhost:3000/api/v1/users/${selectedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: editFullName, 
          email: editEmail, 
          sidebarAccess: editSidebarAccess,
          ...(editPassword && { password: editPassword }) 
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');

      toast.success('User updated successfully!');
      setIsEditModalOpen(false);
      setSelectedUserId(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !user.isBlocked })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user status');

      toast.success(`User ${!user.isBlocked ? 'blocked' : 'unblocked'} successfully!`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:3000/api/v1/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          User Account Management
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Public registration is disabled. Use this form to securely provision new analyst accounts.
        </p>

        <form onSubmit={handleCreateUser} className="max-w-xl space-y-5 bg-[#0B1020] p-6 rounded-xl border border-[#1F2937]/50">
          
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Gmail / Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Temporary Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password..."
                className="w-full bg-[#1F2937] border border-[#374151] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Sidebar Access Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
              Module Access Permissions
            </label>
            <div className="grid grid-cols-2 gap-3 bg-[#1F2937]/50 p-4 rounded-xl border border-[#374151]/50">
              {AVAILABLE_MODULES.map((mod) => (
                <label key={mod.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sidebarAccess.includes(mod.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSidebarAccess([...sidebarAccess, mod.id]);
                      } else {
                        setSidebarAccess(sidebarAccess.filter(id => id !== mod.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-700 transition-colors"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none">{mod.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-150 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Provisioning...' : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Provision New Account
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Active Analysts ({users.length})
        </h2>
        
        <div className="overflow-x-auto rounded-xl border border-[#1F2937]">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading users...</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#0B1020] border-b border-[#1F2937]">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Full Name</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0B1020]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {user.fullName.charAt(0)}
                      </div>
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isBlocked ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        title="Edit User"
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors inline-block"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleBlock(user)}
                        title={user.isBlocked ? "Unblock User" : "Suspend User"}
                        className={`p-1.5 rounded-lg transition-colors inline-block ${
                          user.isBlocked 
                            ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10' 
                            : 'text-amber-400 hover:text-amber-300 hover:bg-amber-400/10'
                        }`}
                      >
                        {user.isBlocked ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(user)}
                        title="Delete User"
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors inline-block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-400" />
                Edit User Details
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#0B1020] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  New Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full bg-[#0B1020] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Edit Sidebar Access Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
                  Module Access Permissions
                </label>
                <div className="grid grid-cols-2 gap-3 bg-[#0B1020]/50 p-4 rounded-xl border border-[#1F2937]">
                  {AVAILABLE_MODULES.map((mod) => (
                    <label key={mod.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={editSidebarAccess.includes(mod.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditSidebarAccess([...editSidebarAccess, mod.id]);
                          } else {
                            setEditSidebarAccess(editSidebarAccess.filter(id => id !== mod.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-700 transition-colors"
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none">{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 bg-transparent hover:bg-[#1F2937] text-white font-medium rounded-xl transition-all border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                >
                  {isUpdating ? 'Saving...' : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-red-900/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#1F2937] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                Confirm Deletion
              </h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1F2937] transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-300 mb-6">
                Are you sure you want to permanently delete <strong className="text-white">{userToDelete?.fullName}</strong> ({userToDelete?.email})? 
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2.5 bg-transparent hover:bg-[#1F2937] text-white font-medium rounded-xl transition-all border border-[#1F2937]"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteUser}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                >
                  {isDeleting ? 'Deleting...' : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
