import React from 'react';
import { MOCK_LEADS } from '../constants';
import { Download } from 'lucide-react';

const Leads: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between p-8 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-3xl font-bold text-white">Leads</h2>
        <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="p-8 overflow-x-auto">
        <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Source</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {MOCK_LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-900/30 transition-colors text-sm text-gray-300">
                  <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
