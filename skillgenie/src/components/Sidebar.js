import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  Map, 
  MessageCircle, 
  Award, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Map className="w-5 h-5" />, label: 'Roadmap', path: '/roadmap' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analysis', path: '/analysis' },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'AI Chat', path: '/chat' },
    { icon: <Award className="w-5 h-5" />, label: 'Quizzes', path: '/quiz' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Careers', path: '/career' }
  ];

  const bottomItems = [
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', path: '/help' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-dark-secondary border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="gradient-bg p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">SkillGenie</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-neon-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-white/10">
        <div className="space-y-2">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-neon-blue text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
