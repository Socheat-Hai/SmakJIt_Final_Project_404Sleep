import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const roleOptions = ['all', 'user', 'organization', 'admin'];
const statusOptions = ['all', 'active', 'suspended', 'banned'];

const AdminUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter !== 'all') params.role = roleFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    adminService.getUsers(params)
      .then((res) => setUsers(res.data))
      .catch(() => showToast('Failed to load users', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(); };

  const updateField = async (id, field, value) => {
    try {
      await adminService.updateUser(id, { [field]: value });
      showToast('User updated');
      fetchUsers();
    } catch { showToast('Failed to update user', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      showToast('User deleted');
      setConfirmDelete(null);
      fetchUsers();
    } catch { showToast('Failed to delete user', 'error'); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-brand-green-light text-brand-green';
      case 'suspended': return 'bg-amber-50 text-amber-600';
      case 'banned': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getVerificationBadge = (user) => {
    if (user.role !== 'organization') return null;
    const v = user.verificationStatus;
    if (v === 'approved') return <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-green-light text-brand-green">✓</span>;
    if (v === 'rejected') return <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600">✗</span>;
    return <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600">?</span>;
  };

  return (
    <div className="max-w-full">
      <h1 className="text-xl font-medium mb-4">Users</h1>

      <div className="card p-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 flex-wrap items-end">
          <div className="min-w-[180px] flex-1">
            <label className="text-[11px] text-gray-500 mb-0.5 block">Search</label>
            <input type="text" placeholder="Name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-sm text-sm outline-none focus:border-brand-green" />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-0.5 block">Role</label>
            <div className="flex gap-1">
              {roleOptions.map((r) => (
                <button key={r} type="button" onClick={() => setRoleFilter(r)}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-medium capitalize transition-colors ${roleFilter === r ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-0.5 block">Status</label>
            <div className="flex gap-1">
              {statusOptions.map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded text-[11px] font-medium capitalize transition-colors ${statusFilter === s ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm !px-3 !py-[7px]">Go</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center py-10 px-4 text-gray-400">
          <div className="text-2xl mb-1">👥</div>
          <p className="text-[13px]">No users found.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 text-[11px] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-purple text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate max-w-[160px]">{u.name}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[160px]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                        u.role === 'admin' ? 'bg-red-50 text-red-600' :
                        u.role === 'organization' ? 'bg-brand-purple-light text-brand-purple' :
                        'bg-brand-green-light text-brand-green'
                      }`}>{u.role}</span>
                      {getVerificationBadge(u)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <select value={u.status || 'active'} onChange={(e) => updateField(u._id, 'status', e.target.value)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border-0 outline-none cursor-pointer ${getStatusColor(u.status || 'active')}`}>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-gray-400 text-[12px] whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {u.role === 'organization' && u.verificationStatus === 'pending' && (
                        <>
                          <button onClick={() => updateField(u._id, 'verificationStatus', 'approved')}
                            className="text-brand-green text-[11px] font-medium hover:underline">Approve</button>
                          <button onClick={() => updateField(u._id, 'verificationStatus', 'rejected')}
                            className="text-red-500 text-[11px] font-medium hover:underline">Reject</button>
                        </>
                      )}
                      {confirmDelete === u._id ? (
                        <>
                          <button onClick={() => handleDelete(u._id)} className="text-red-500 text-[11px] font-medium hover:underline">Confirm</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-gray-500 text-[11px] hover:underline">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDelete(u._id)} className="text-gray-400 hover:text-red-500 text-[11px] font-medium">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
