import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? 'bg-blue-600' : 'hover:bg-gray-700';

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              DiagnósticoPro
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/diagnostico"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/diagnostico')}`}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Diagnóstico
              </Link>
              
              <Link
                to="/backoffice"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/backoffice')}`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Backoffice
              </Link>
              
              <Link
                to="/resultados"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/resultados')}`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Resultados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}