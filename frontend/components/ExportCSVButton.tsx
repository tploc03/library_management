/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CSVLink } from 'react-csv';

interface ExportCSVButtonProps {
  data: any[];
  headers: { label: string; key: string }[];
  filename: string;
}

export default function ExportCSVButton({ data, headers, filename }: ExportCSVButtonProps) {
  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={filename}
      className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700 transition-colors"
      target="_blank"
    >
      Xuất ra CSV
    </CSVLink>
  );
}
