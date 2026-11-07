import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  FolderLock, 
  Layers,
  Sparkles,
  Edit2
} from 'lucide-react';
import { Course, OrderRecord } from '../types';

interface CourseManagerProps {
  courses: Course[];
  orders: OrderRecord[];
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({
  courses,
  orders,
  onAddCourse,
  onDeleteCourse
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'orders'>('courses');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new course
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('799');
  const [newCategory, setNewCategory] = useState('Tech');
  const [newChannelId, setNewChannelId] = useState('-1001928374829');
  const [newChannelName, setNewChannelName] = useState('VIP Mentorship Lounge');
  const [newMaterialsLink, setNewMaterialsLink] = useState('https://drive.google.com/drive/folders/sample-course');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const course: Course = {
      id: 'course-' + Date.now(),
      title: newTitle.trim(),
      titleHindi: newTitle.trim(),
      category: newCategory,
      price: Number(newPrice) || 499,
      originalPrice: (Number(newPrice) || 499) * 3,
      description: newDesc.trim() || 'Comprehensive masterclass with private VIP channel mentorship.',
      curriculum: [
        'Module 1: Foundations & Core Concepts',
        'Module 2: Advanced Practical Projects',
        'Module 3: Live Q&A and Community Mentorship'
      ],
      materialsLink: newMaterialsLink.trim() || 'https://drive.google.com',
      channelName: newChannelName.trim() || 'VIP Private Channel',
      channelId: newChannelId.trim() || '-1001234567890'
    };

    onAddCourse(course);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Admin Control Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">Course & Member Access Management</h2>
          <p className="text-sm text-slate-400 mt-1">
            Yahan se naye courses add karein, unke private channel links configure karein aur purchases dekhein.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'courses' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders & Access ({orders.length})
            </button>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{course.category}</span>
                  <span className="font-mono text-cyan-400 font-bold text-base">₹{course.price}</span>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{course.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-400" /> Linked Channel:
                    </span>
                    <span className="text-white font-mono truncate max-w-[140px]">{course.channelName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Channel ID:</span>
                    <span className="font-mono text-slate-300">{course.channelId}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={course.materialsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <FolderLock className="w-3.5 h-3.5" />
                  <span>Materials Vault</span>
                </a>

                {courses.length > 1 && (
                  <button
                    onClick={() => onDeleteCourse(course.id)}
                    className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Invite Link Generated</th>
                  <th className="py-3.5 px-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">{order.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{order.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {order.userTelegramId}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">{order.courseTitle}</td>
                    <td className="py-3 px-4 font-mono text-cyan-300 font-bold tabular-nums">
                      ₹{order.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Paid</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-[10px] text-cyan-400 max-w-[150px] truncate select-all">
                        {order.inviteLink}
                      </div>
                      <div className="text-[10px] text-slate-500">Single-use (Limit: 1)</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Naya Course Add Karein</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Python & AI Bot Automation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Price in ₹</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Telegram Private Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Telegram Channel ID (starts with -100)</label>
                <input
                  type="text"
                  value={newChannelId}
                  onChange={(e) => setNewChannelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Course Vault / Drive Link</label>
                <input
                  type="url"
                  value={newMaterialsLink}
                  onChange={(e) => setNewMaterialsLink(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What students will achieve..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Save & Publish to Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
