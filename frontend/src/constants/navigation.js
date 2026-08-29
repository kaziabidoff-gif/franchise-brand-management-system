import {
  FiArchive,
  FiBell,
  FiBookOpen,
  FiBriefcase,
  FiBarChart2,
  FiGrid,
  FiMapPin,
  FiMessageSquare,
  FiUser,
  FiUsers,
  FiActivity
} from 'react-icons/fi';

export const roleLabels = {
  super_admin: 'Super Admin',
  brand_manager: 'Brand Manager',
  marketing_executive: 'Marketing Executive',
  graphic_designer: 'Graphic Designer',
  branch_manager: 'Branch Manager'
};

export const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: FiGrid, roles: ['all'] },
  { key: 'users', label: 'Users', path: '/users', icon: FiUsers, roles: ['super_admin', 'brand_manager'] },
  { key: 'branches', label: 'Branches', path: '/branches', icon: FiMapPin, roles: ['super_admin', 'brand_manager'] },
  { key: 'assets', label: 'Brand Assets', path: '/assets', icon: FiArchive, roles: ['all'] },
  { key: 'campaigns', label: 'Campaigns', path: '/campaigns', icon: FiBriefcase, roles: ['super_admin', 'brand_manager', 'marketing_executive', 'branch_manager'] },
  { key: 'guidelines', label: 'Guidelines', path: '/guidelines', icon: FiBookOpen, roles: ['all'] },
  { key: 'requests', label: 'Requests', path: '/requests', icon: FiMessageSquare, roles: ['all'] },
  { key: 'reports', label: 'Reports', path: '/reports', icon: FiBarChart2, roles: ['super_admin', 'brand_manager', 'marketing_executive'] },
  { key: 'branch-users', label: 'Branch Users', path: '/branch-users', icon: FiUsers, roles: ['super_admin', 'brand_manager'] },
  { key: 'branch-activities', label: 'Branch Activities', path: '/branch-activities', icon: FiActivity, roles: ['super_admin', 'brand_manager', 'marketing_executive', 'branch_manager'] },
  { key: 'notifications', label: 'Notifications', path: '/notifications', icon: FiBell, roles: ['all'] },
  { key: 'profile', label: 'Profile', path: '/profile', icon: FiUser, roles: ['all'] }
];

export const canAccess = (item, role) => item.roles.includes('all') || item.roles.includes(role);

export const menuForRole = (role) => navItems.filter((item) => canAccess(item, role));
