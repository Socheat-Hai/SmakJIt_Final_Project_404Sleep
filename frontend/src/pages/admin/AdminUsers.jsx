import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToast } from '../../components/Toast';

const roleOptions = ['all', 'volunteer', 'organization', 'admin'];
const statusOptions = ['all', 'active', 'inactive', 'banned'];

const AdminUsers = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter !== 'all') {
      params.role = roleFilter;
    }
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
    if (field === 'status') {
      await adminService.updateUserStatus(id, value);
    } else if (field === 'org_status') {
      await adminService.updateOrgVerification(id, value);
    }
    showToast('User updated');
    fetchUsers();
  } catch {
    showToast('Failed to update user', 'error');
  }
};

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      showToast('User deleted');
      setConfirmDelete(null);
      fetchUsers();
    } catch { showToast('Failed to delete user', 'error'); }
  };

  const handleRowClick = async (id) => {
  try {
    const res = await adminService.getUserById(id);
    setSelectedUser(res.data);
  } catch {
    showToast('Failed to load user details', 'error');
  }
};

const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-brand-green-light text-brand-green';
      case 'inactive': return 'bg-amber-50 text-amber-600';
      case 'banned': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getVerificationBadge = (user) => {
    if (user.role !== 'organization') return null;
    const v = user.org_status;
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
                        className={`px-2.5 py-1.5 rounded text-[11px] font-medium capitalize transition-colors ${roleFilter === r ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {r === 'user' ? 'Volunteer' : r}
                      </button>
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
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer" onClick={() => handleRowClick(u.id)}>
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
                        <select value={u.status || 'active'} onChange={(e) => updateField(u.id, 'status', e.target.value)} onClick={(e) => e.stopPropagation()}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border-0 outline-none cursor-pointer ${getStatusColor(u.status || 'active')}`}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="banned">Banned</option>
                        </select>
                      </td>
                      <td className="px-4 py-2.5 text-gray-400 text-[12px] whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role === 'organization' && u.org_status === 'pending' && (
                            <>
    <button onClick={(e) => { e.stopPropagation(); updateField(u.id, 'org_status', 'approved'); }}
                                  className="text-brand-green text-[11px] font-medium hover:underline">Approve</button>
    <button onClick={(e) => { e.stopPropagation(); updateField(u.id, 'org_status', 'rejected'); }}
                                  className="text-red-500 text-[11px] font-medium hover:underline">Reject</button>
                            </>
                          )}
                          {confirmDelete === u.id ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(u.id); }} className="text-red-500 text-[11px] font-medium hover:underline">Confirm</button>
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }} className="text-gray-500 text-[11px] hover:underline">Cancel</button>
                            </>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(u.id); }} className="text-gray-400 hover:text-red-500 text-[11px] font-medium">Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setSelectedUser(null)}>✕</button>
          <h3 className="text-xl font-medium mb-4">User Details</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
            {selectedUser.role === 'volunteer' && (
              <>
                <p><strong>Phone:</strong> {selectedUser.phone_num}</p>
                <p><strong>Bio:</strong> {selectedUser.volunteer_bio}</p>
                <p><strong>Location:</strong> {selectedUser.volunteer_location}</p>
                <p><strong>DOB:</strong> {selectedUser.volunteer_dob}</p>
                <p><strong>Gender:</strong> {selectedUser.volunteer_gender}</p>
                <p><strong>Skills:</strong> {selectedUser.volunteer_skills && selectedUser.volunteer_skills.length > 0 ? (
                  <span className="flex flex-wrap gap-1">
                    {selectedUser.volunteer_skills.map((skill,i)=>(
                      <span key={i} className="px-2 py-1 rounded-full bg-brand-green-light text-brand-green text-xs">{skill}</span>
                    ))}
                  </span>
                ) : 'None'}</p>
                <p><strong>Interests:</strong> {selectedUser.volunteer_interests && selectedUser.volunteer_interests.length > 0 ? selectedUser.volunteer_interests.join(', ') : 'None'}</p>
              </>
            )}
            {selectedUser.role === 'organization' && (
              <>
                <p><strong>Org Name:</strong> {selectedUser.org_name}</p>
                <p><strong>Website:</strong> {selectedUser.org_website}</p>
                <p><strong>Description:</strong> {selectedUser.org_description}</p>
                <p><strong>Contact Email:</strong> {selectedUser.org_contact_email}</p>
                <p><strong>Contact Phone:</strong> {selectedUser.org_contact_phone}</p>
                <p><strong>Location:</strong> {selectedUser.org_location}</p>
                <p><strong>Verification Status:</strong> {selectedUser.org_status}</p>
              </>
            )}
          </div>
        </div>
</div>
    )}
    </div>
  );
};

export default AdminUsers;
