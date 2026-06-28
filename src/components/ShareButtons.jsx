import React, { useState } from 'react';
import { FaWhatsapp, FaCopy, FaShareAlt, FaCheck } from 'react-icons/fa';

const ShareButtons = ({ productName, price }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = `Check out this amazing product from Moderate's Textile: ${productName} for ${price}!`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-gray-500 mr-1">Share:</span>
      
      <button
        onClick={handleWhatsAppShare}
        className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
        title="Share on WhatsApp"
      >
        <FaWhatsapp size={16} />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      {navigator.share ? (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          title="Share"
        >
          <FaShareAlt size={14} />
          <span>Share</span>
        </button>
      ) : null}

      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          copied 
            ? 'bg-emerald-100 text-emerald-800' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Copy link to clipboard"
      >
        {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
};

export default ShareButtons;
