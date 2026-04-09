'use client';

import React, { useState, useMemo } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  idField?: keyof T;
  emptyMessage?: string;
  loadingMessage?: string;
  itemsPerPage?: number;
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  isLoading = false,
  onEdit,
  onDelete,
  idField = '_id',
  emptyMessage = 'No data found in the system',
  loadingMessage = 'Synchronizing Data',
  itemsPerPage = 10,
}: DataTableProps<T>) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = Math.ceil(data.length / pageSize);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  // Reset to page 1 if data size changes significantly
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="bg-white border border-ink/10 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ink/10 bg-gray-50/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-6 text-[10px] font-black uppercase tracking-[0.3em] text-ink/30 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-ink/30 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border border-ink/10 border-t-ink rounded-full animate-spin"></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-ink/40">
                      {loadingMessage}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-20 text-center">
                  <p className="text-[11px] uppercase font-bold tracking-widest text-ink/30 italic">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <tr key={(item[idField] as string) || rowIndex} className="group hover:bg-cream/30 transition-colors">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={`p-6 ${column.className || ''}`}>
                      {typeof column.accessor === 'function'
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 hover:bg-ink text-ink hover:text-white border border-ink/5 transition-all"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete((item[idField] as string) || '')}
                            className="p-2 hover:bg-red-600 text-ink hover:text-white border border-ink/5 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoading && data.length > 0 && (
        <div className="px-6 py-4 border-t border-ink/5 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-bold text-ink/30 uppercase tracking-widest">
            Showing <span className="text-ink">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-ink">{Math.min(currentPage * pageSize, data.length)}</span> of <span className="text-ink">{data.length}</span> results
          </div>

          <div className="flex items-center gap-6">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-ink/20 uppercase tracking-widest">Rows per page</span>
              <select 
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[11px] font-bold text-ink focus:outline-none cursor-pointer"
              >
                {[5, 10, 25, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 rounded-md hover:bg-ink/5 disabled:opacity-20 transition-all"
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-md hover:bg-ink/5 disabled:opacity-20 transition-all font-bold"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center px-4 py-1 bg-ink/5 rounded-lg">
                <span className="text-[11px] font-black text-ink tracking-widest">{currentPage} / {totalPages}</span>
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-md hover:bg-ink/5 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 rounded-md hover:bg-ink/5 disabled:opacity-20 transition-all"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
