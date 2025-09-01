import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HiHome, 
  HiSearch, 
  HiLibrary, 
  HiOutlineMenu, 
  HiX,
  HiMusicNote,
  HiHeart,
  HiClock
} from 'react-icons/hi';

const NavLinks = ({ handleClick }: { handleClick?: () => void }) => {
  const links = [
    { name: 'Home', to: '/', icon: HiHome },
    { name: 'Discover', to: '/discover', icon: HiSearch },
    { name: 'Online Music', to: '/online', icon: HiMusicNote },
    { name: 'Library', to: '/library', icon: HiLibrary },
    { name: 'Favorites', to: '/favorites', icon: HiHeart },
    { name: 'Recent', to: '/recent', icon: HiClock },
  ];

  return (
    <div className="mt-10">
      {links.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-row justify-start items-center my-8 text-base font-medium hover:text-primary-400 transition-colors ${
              isActive ? 'text-primary-400' : 'text-gray-400'
            }`
          }
          onClick={() => handleClick && handleClick()}
        >
          <item.icon className="w-6 h-6 mr-3" />
          {item.name}
        </NavLink>
      ))}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[240px] px-4 bg-dark-900 border-r border-dark-700">
        <div className="flex items-center py-6">
          <HiMusicNote className="w-8 h-8 text-primary-400 mr-2" />
          <h1 className="text-xl font-bold text-white">Concerto</h1>
        </div>
        <NavLinks />
      </div>

      {/* Mobile Menu Button */}
      <div className="absolute md:hidden block top-6 right-3 z-50">
        {!mobileMenuOpen ? (
          <HiOutlineMenu 
            className="w-6 h-6 text-white cursor-pointer" 
            onClick={() => setMobileMenuOpen(true)} 
          />
        ) : (
          <HiX 
            className="w-6 h-6 text-white cursor-pointer" 
            onClick={() => setMobileMenuOpen(false)} 
          />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 h-screen w-2/3 bg-gradient-to-br from-dark-900 to-dark-800 backdrop-blur-lg z-40 p-6 md:hidden transition-transform duration-300 ${
        mobileMenuOpen ? 'left-0' : '-left-full'
      }`}>
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <HiMusicNote className="w-8 h-8 text-primary-400 mr-2" />
            <h1 className="text-xl font-bold text-white">Concerto</h1>
          </div>
        </div>
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
