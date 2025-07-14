// components/DynamicExportCSVButton.tsx
'use client';

import dynamic from 'next/dynamic';

const ExportCSVButton = dynamic(() => import('./ExportCSVButton'), {
  ssr: false,
});

export default ExportCSVButton;
