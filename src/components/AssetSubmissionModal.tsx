import React, { useState } from 'react';
import { X, Check, AlertCircle, Sparkles, Upload, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { verifyFractionContract, VerificationResult } from '../lib/verifyContract';

interface AssetSubmissionModalProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  walletAddress: string;
}

export const AssetSubmissionModal: React.FC<AssetSubmissionModalProps> = ({
  onClose,
  onSubmitSuccess,
  walletAddress
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('depin_gpu');
  const [location, setLocation] = useState<string>('');
  const [totalValueUSD, setTotalValueUSD] = useState<string>('');
  const [apy, setApy] = useState<string>('');
  const [riskScore, setRiskScore] = useState<string>('AA+');
  const [description, setDescription] = useState<string>('');
  const [features, setFeatures] = useState<string>('');

  // Step 2 State (Contract & Telemetry)
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isValidatingContract, setIsValidatingContract] = useState<boolean>(false);
  const [contractVerification, setContractVerification] = useState<VerificationResult | null>(null);

  const [fractionPriceBOT, setFractionPriceBOT] = useState<string>('0.1');
  const [totalFractions, setTotalFractions] = useState<string>('1000000');
  const [availableFractions, setAvailableFractions] = useState<string>('500000');

  const [telemetryType, setTelemetryType] = useState<string>('GPU Load & Compute');
  const [telemetryCurrentValue, setTelemetryCurrentValue] = useState<string>('95.2');
  const [telemetryUnit, setTelemetryUnit] = useState<string>('% Utilization');
  const [verifier, setVerifier] = useState<string>('Compute Telemetry Oracle');
  const [spvDocumentHash, setSpvDocumentHash] = useState<string>('');

  // Step 3 State (Media)
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Categories Map
  const categoryNames: { [key: string]: string } = {
    depin_gpu: 'DePIN AI Compute',
    solar_farm: 'Green DePIN Energy',
    real_estate: 'Institutional Real Estate',
    treasury: 'Government Debt Vault'
  };

  const handleValidateContract = async () => {
    if (!contractAddress.trim()) return;
    setIsValidatingContract(true);
    setContractVerification(null);
    const result = await verifyFractionContract(contractAddress.trim());
    setContractVerification(result);
    setIsValidatingContract(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError(null);

    try {
      let finalImageUrl = imageUrl.trim();

      // If they uploaded a file, prioritize uploading it to storage
      if (imageFile) {
        setUploadProgress('Uploading asset image file...');
        // Standard base64 fallback or relative mock path for images when using custom Express backend
        finalImageUrl = `/assets/${category}.png`;
        setUploadProgress(null);
      }

      // Default placeholder if no image provided
      if (!finalImageUrl) {
        finalImageUrl = `/assets/${category}.png`;
      }

      // Calculate fractionPriceUSDT based on active BOT price (approx $0.20 per BOT)
      const botPrice = parseFloat(fractionPriceBOT);
      const usdtPrice = botPrice * 0.20;

      const payload = {
        name: name.trim(),
        category,
        categoryName: categoryNames[category] || 'Tokenized RWA Asset',
        location: location.trim(),
        totalValueUSD: parseFloat(totalValueUSD) || 0,
        fractionPriceBOT: botPrice || 0.1,
        fractionPriceUSDT: usdtPrice,
        totalFractions: parseInt(totalFractions) || 1000000,
        availableFractions: parseInt(availableFractions) || 500000,
        apy: parseFloat(apy) || 0,
        riskScore,
        telemetryType: telemetryType.trim(),
        telemetryCurrentValue: telemetryCurrentValue.trim(),
        telemetryUnit: telemetryUnit.trim(),
        verifier: verifier.trim(),
        spvDocumentHash: spvDocumentHash.trim(),
        contractAddress: contractAddress.trim(),
        description: description.trim(),
        features: features.split(',').map((f) => f.trim()).filter(Boolean),
        imageUrl: finalImageUrl,
        submitterAddress: walletAddress.toLowerCase(),
        status: 'pending' // pending admin review
      };

      const apiHost = ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) || 'http://localhost:3001';
      const response = await fetch(`${apiHost}/api/assets/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      setIsSubmitting(false);
      onSubmitSuccess();
    } catch (err: any) {
      console.error('Submission error:', err);
      setGeneralError(err.message || 'Failed to submit asset listing.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-purple-950/20 via-surface to-cyan-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">List Your RWA Asset</h2>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">Submit fraction token metadata for admin review</p>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center space-x-2 mt-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono font-bold border transition-all ${
                  step === s
                    ? 'bg-purple-500 border-purple-400 text-white'
                    : step > s
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 rounded transition-all ${step > s ? 'bg-emerald-500/30' : 'bg-white/5'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[50vh] overflow-y-auto font-mono text-xs">
          
          {generalError && (
            <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300">Asset Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahara Solar Farm II"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white"
                  >
                    <option value="depin_gpu">DePIN AI Compute</option>
                    <option value="solar_farm">Green DePIN Energy</option>
                    <option value="real_estate">Institutional Real Estate</option>
                    <option value="treasury">Government Debt Vault</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300">Location:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New York, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300">Total Valuation (USD):</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 5000000"
                    value={totalValueUSD}
                    onChange={(e) => setTotalValueUSD(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-gray-300">APY %:</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="8.5"
                      value={apy}
                      onChange={(e) => setApy(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-gray-300">Risk Score:</label>
                    <select
                      value={riskScore}
                      onChange={(e) => setRiskScore(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-xl text-white"
                    >
                      <option value="AAA">AAA</option>
                      <option value="AA+">AA+</option>
                      <option value="A+">A+</option>
                      <option value="BBB">BBB</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300">Description:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details about the physical asset SPV structure, hardware telemetry backing, and yields."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300">Key Features (comma-separated):</label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 IoT Telemetry, Direct API Rental Revenue, Insured Hardware SPV"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-600"
                />
              </div>
            </div>
          )}

          {/* STEP 2: On-Chain Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-sans">
                <strong>Deployment Verification:</strong> Veritas requires that you deploy your fractional ERC-20 token smart contract to BOT Chain Testnet first. Paste the contract address below to verify bytecode deployment on-chain.
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300">Fraction Contract Address (vToken):</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="glass-input flex-1 px-3 py-2 rounded-xl text-white placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={handleValidateContract}
                    disabled={isValidatingContract || !contractAddress.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold uppercase transition-all whitespace-nowrap disabled:opacity-40"
                  >
                    {isValidatingContract ? 'Verifying...' : 'Verify On-Chain'}
                  </button>
                </div>
              </div>

              {contractVerification && (
                <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                  contractVerification.isValid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {contractVerification.isValid ? (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Contract Bytecode Verified on BOT Chain</span>
                      </div>
                      <div className="pl-5 text-gray-400">
                        Token Name: {contractVerification.name} • Symbol: {contractVerification.symbol} • Supply: {contractVerification.totalSupply}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      <span>{contractVerification.error}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-300">Fraction Price (BOT):</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={fractionPriceBOT}
                    onChange={(e) => setFractionPriceBOT(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300">Total Fractions Supply:</label>
                  <input
                    type="number"
                    required
                    value={totalFractions}
                    onChange={(e) => setTotalFractions(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-300">Fractions Available for Mint:</label>
                  <input
                    type="number"
                    required
                    value={availableFractions}
                    onChange={(e) => setAvailableFractions(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/5 space-y-3">
                <span className="font-bold text-white block text-[11px]">IoT Telemetry Specifications</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400">Telemetry Metric Type:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GPU Load & Compute"
                      value={telemetryType}
                      onChange={(e) => setTelemetryType(e.target.value)}
                      className="glass-input w-full px-3 py-1.5 rounded-lg text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-gray-400">Current Value:</label>
                      <input
                        type="text"
                        required
                        value={telemetryCurrentValue}
                        onChange={(e) => setTelemetryCurrentValue(e.target.value)}
                        className="glass-input w-full px-3 py-1.5 rounded-lg text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Unit Label:</label>
                      <input
                        type="text"
                        required
                        value={telemetryUnit}
                        onChange={(e) => setTelemetryUnit(e.target.value)}
                        className="glass-input w-full px-3 py-1.5 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400">Telemetry Verifier/Oracle:</label>
                    <input
                      type="text"
                      required
                      value={verifier}
                      onChange={(e) => setVerifier(e.target.value)}
                      className="glass-input w-full px-3 py-1.5 rounded-lg text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400">SPV Legal IPFS Hash:</label>
                    <input
                      type="text"
                      placeholder="Qm..."
                      value={spvDocumentHash}
                      onChange={(e) => setSpvDocumentHash(e.target.value)}
                      className="glass-input w-full px-3 py-1.5 rounded-lg text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Media & Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-gray-300 block">Asset Image:</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Box */}
                  <label className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImageFile(file);
                      }}
                    />
                    <Upload className="w-6 h-6 text-purple-400 mb-2" />
                    <span className="text-[11px] font-bold text-gray-300">
                      {imageFile ? imageFile.name : 'Upload Asset Image'}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1">PNG, JPEG or WEBP (Max 5MB)</span>
                  </label>

                  {/* Direct Image URL input */}
                  <div className="space-y-2">
                    <label className="text-gray-400 block text-[11px]">Or provide direct image URL:</label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.png"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="glass-input w-full px-3 py-2 rounded-xl text-white placeholder:text-gray-700"
                    />
                    <p className="text-[10px] text-gray-500">Falls back to category template image if left empty.</p>
                  </div>
                </div>

                {uploadProgress && (
                  <div className="text-[11px] text-purple-300 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                    <span>{uploadProgress}</span>
                  </div>
                )}
              </div>

              {/* Review Summary Card */}
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-3 font-sans text-[11px]">
                <span className="font-extrabold text-white block text-xs border-b border-white/10 pb-1.5">Submission Summary</span>
                <div className="grid grid-cols-2 gap-2 text-gray-400">
                  <div>Asset Name: <strong className="text-white">{name}</strong></div>
                  <div>Category: <strong className="text-white">{categoryNames[category]}</strong></div>
                  <div>Location: <strong className="text-white">{location}</strong></div>
                  <div>Valuation: <strong className="text-white">${parseFloat(totalValueUSD || '0').toLocaleString()} USD</strong></div>
                  <div>APY Rate: <strong className="text-white">{apy}% / year</strong></div>
                  <div>Fraction Price: <strong className="text-white">{fractionPriceBOT} BOT</strong></div>
                  <div className="col-span-2 truncate">Contract Address: <strong className="text-white font-mono">{contractAddress}</strong></div>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex items-center justify-between font-mono text-xs">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold transition-all flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && (!contractVerification || !contractVerification.isValid)}
              className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold uppercase transition-all flex items-center space-x-1.5 disabled:opacity-40"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold uppercase transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Submit for Review</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
