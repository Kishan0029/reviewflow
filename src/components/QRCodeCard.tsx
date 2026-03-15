import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodeCardProps {
  url: string;
  locationName: string;
}

export default function QRCodeCard({ url, locationName }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleDownload() {
    const canvas = document.querySelector(`canvas[data-location="${locationName}"]`) as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `reviewflow-qr-${locationName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-xl border border-[#E0E0E0] shadow-sm">
        <QRCodeCanvas
          value={url}
          size={180}
          data-location={locationName}
          bgColor="#FFFFFF"
          fgColor="#202124"
          level="M"
        />
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 text-sm font-medium text-[#1A73E8] hover:bg-[#E8F0FE] px-4 py-2 rounded-lg transition"
      >
        <Download size={16} /> Download PNG
      </button>
    </div>
  );
}
