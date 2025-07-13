"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { toast } from 'react-toastify';

const UserManagementPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clubFilter, setClubFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    club: 'IEDC'
  });

  const DEFAULT_CLUBS = ['Main'];

  const inputStyles = "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2";
  const buttonStyles = "px-6 py-2 rounded-lg transition-colors";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewUser({ name: '', email: '', club: 'IEDC' });
    setShowAddForm(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailExists = users.some(user => 
      user.email?.toLowerCase() === newUser.email.toLowerCase()
    );
    if (emailExists) {
      toast.error("A user with this email already exists");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        club: newUser.club,
        createdAt: new Date().toISOString()
      });
      
      toast.success("User added successfully");
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user");
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      try {
        await deleteDoc(doc(db, "users", userId));
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
      }
    }
  };

  const handleUpdateClub = async (userId, newClub) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        club: newClub
      });
      toast.success("User club updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user club");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const availableClubs = users.length > 0 
    ? [...new Set(users.map(user => user.club || user.society).filter(Boolean))]
    : DEFAULT_CLUBS;

  const allClubs = ['All', ...availableClubs];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const userClub = user.club || user.society;
    const matchesClub = clubFilter === 'All' || userClub === clubFilter;
    return matchesSearch && matchesClub;
  });

  const getClubCount = (club) => users.filter(u => (u.club || u.society) === club).length;

  // Get unique club/society names from users in DB
  const uniqueClubs = [
    ...new Set(users.map(user => user.club || user.society).filter(Boolean))
  ];

  const statistics = [
    { label: 'Total Users', count: users.length, color: 'text-blue-600' },
    ...uniqueClubs.map(club => ({
      label: `${club} Members`,
      count: getClubCount(club),
    }))
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management Panel</h1>
            <p className="text-gray-600">Manage all registered users ({users.length} total)</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`bg-green-500 text-white hover:bg-green-600 ${buttonStyles} flex items-center gap-2`}
          >
            <span className="text-xl">+</span>
            Add New User
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-3">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className={`${inputStyles} focus:ring-green-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className={`${inputStyles} focus:ring-green-500`}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club
                </label>
                <select
                  value={newUser.club}
                  onChange={(e) => setNewUser({...newUser, club: e.target.value})}
                  className={`${inputStyles} focus:ring-green-500`}
                >
                  {availableClubs.map(club => (
                    <option key={club} value={club}>{club}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className={`bg-green-500 text-white hover:bg-green-600 ${buttonStyles}`}
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`bg-gray-500 text-white hover:bg-gray-600 ${buttonStyles}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputStyles} focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Club
              </label>
              <select
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className={`${inputStyles} focus:ring-blue-500`}
              >
                {allClubs.map(club => (
                  <option key={club} value={club}>{club}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </span>
            <button
              onClick={fetchUsers}
              className={`bg-blue-500 text-white hover:bg-blue-600 ${buttonStyles}`}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Club
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'No name provided'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                          {user.createdAt && (
                            <div className="text-xs text-gray-400">
                              Added: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.club || user.society || 'Main'}
                        onChange={(e) => handleUpdateClub(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {availableClubs.map(club => (
                          <option key={club} value={club}>{club}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPanel;
