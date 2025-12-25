import { useState } from 'react';
import { Users, Plus, MoreVertical, Briefcase, UserPlus, X } from 'lucide-react';
import { useRBAC } from '../hooks/useRBAC';
import { useAuth } from '../context/AuthContext';

// Mock Data
const MOCK_TEAMS = [
    { id: 1, name: 'Engineering', manager: 'Aarav Sharma', members: 12, description: 'Core product development team' },
    { id: 2, name: 'Design', manager: 'Priya Singh', members: 5, description: 'UI/UX and creative design' },
    { id: 3, name: 'Sales', manager: 'Vikram Malhotra', members: 8, description: 'Domestic and international sales' },
    { id: 4, name: 'Marketing', manager: 'Sneha Gupta', members: 4, description: 'Brand awareness and campaigns' },
];

const MOCK_EMPLOYEES = [
    { id: 101, name: 'Raman Thakur', role: 'Frontend Dev' },
    { id: 102, name: 'Jane Smith', role: 'Backend Dev' },
    { id: 103, name: 'Mike Johnson', role: 'Designer' },
    { id: 104, name: 'Sarah Wilson', role: 'Sales Exec' },
];

export default function Team() {
    const { hasPermission } = useRBAC();
    const { user } = useAuth();
    const canManageTeams = hasPermission(['HR_ADMIN', 'MANAGER']);

    const [teams, setTeams] = useState(MOCK_TEAMS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

    // Form State
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDesc, setNewTeamDesc] = useState('');

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        const newTeam = {
            id: teams.length + 1,
            name: newTeamName,
            manager: user?.name || 'Current User', // Assign creator as manager for now
            members: 0,
            description: newTeamDesc
        };
        setTeams([...teams, newTeam]);
        setShowCreateModal(false);
        setNewTeamName('');
        setNewTeamDesc('');
        alert('Team created successfully!');
    };

    return (
        <div className="animate-fade-in-up pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Team Management</h2>
                    <p className="text-gray-500 dark:text-gray-400">Organize your workforce into functional units.</p>
                </div>
                {canManageTeams && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Create New Team
                    </button>
                )}
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white dark:bg-brand-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                    <Briefcase size={24} />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{team.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">{team.description}</p>

                            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
                                    {team.manager[0]}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Manager</p>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{team.manager}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Users size={16} />
                                    <span className="font-semibold">{team.members} Members</span>
                                </div>
                                <button
                                    onClick={() => setSelectedTeam(team.id)}
                                    className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
                                >
                                    View Members
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Team Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Create New Team</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Team Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="e.g. Quality Assurance"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    rows={3}
                                    value={newTeamDesc}
                                    onChange={(e) => setNewTeamDesc(e.target.value)}
                                    placeholder="Brief description of the team's responsibilities"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500/50 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all mt-2"
                            >
                                Create Team
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Members Modal (Mock) */}
            {selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{teams.find(t => t.id === selectedTeam)?.name}</h3>
                                <p className="text-sm text-gray-500">Team Roster</p>
                            </div>
                            <button onClick={() => setSelectedTeam(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">

                            {canManageTeams && (
                                <button className="w-full py-2 mb-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:border-brand-500 hover:text-brand-500 transition-all flex items-center justify-center gap-2 font-medium">
                                    <UserPlus size={18} /> Add Member
                                </button>
                            )}

                            {MOCK_EMPLOYEES.map(emp => (
                                <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm">{emp.name}</p>
                                            <p className="text-xs text-gray-500">{emp.role}</p>
                                        </div>
                                    </div>
                                    {canManageTeams && (
                                        <button className="text-xs text-red-500 hover:underline">Remove</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
