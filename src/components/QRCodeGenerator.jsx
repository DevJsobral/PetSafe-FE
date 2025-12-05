import React, { useEffect, useRef, useState } from 'react'

// Função simples para gerar QR Code usando API pública
function QRCodeGenerator({ value, size = 200, userId, petId = null }) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // URL base do seu app
  const baseUrl = window.location.origin
  const shareUrl = petId 
    ? `${baseUrl}/share/user/${userId}/pet/${petId}`
    : `${baseUrl}/share/user/${userId}`
  
  // API gratuita para gerar QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(shareUrl)}`
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = petId ? `qrcode-pet-${petId}.png` : `qrcode-perfil-${userId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - PetSafe</title>
          <style>
            body { 
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              padding: 40px;
              border: 2px solid #14b8a6;
              border-radius: 20px;
            }
            h1 { color: #14b8a6; margin-bottom: 10px; }
            p { color: #666; margin-bottom: 20px; }
            img { border: 10px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🐾 PetSafe</h1>
            <p>Escaneie para ver ${petId ? 'informações do pet' : 'meu perfil e meus pets'}</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="footer">
              <p>${shareUrl}</p>
              <p>www.petsafe.com</p>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg font-medium transition-colors shadow-sm"
      >
        <span>📱</span>
        <span>QR Code</span>
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📱</span>
                {petId ? 'QR Code do Pet' : 'QR Code do Perfil'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* QR Code */}
            <div className="p-6">
              <div className="bg-white p-6 rounded-xl border-4 border-teal-500 mx-auto w-fit mb-4">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-64 h-64"
                />
              </div>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">
                {petId 
                  ? 'Escaneie para ver as informações deste pet'
                  : 'Escaneie para ver meu perfil e todos os meus pets'
                }
              </p>
              
              {/* Link para copiar */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors"
                  >
                    {copied ? '✓ Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <span>💾</span>
                  <span>Baixar</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <span>🖨️</span>
                  <span>Imprimir</span>
                </button>
              </div>
              
              {/* Info */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-400">
                  💡 <strong>Dica:</strong> Cole este QR Code na coleira do seu pet ou salve no celular para emergências!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default QRCodeGenerator