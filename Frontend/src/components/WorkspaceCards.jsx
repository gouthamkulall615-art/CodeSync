import React, { useState, useRef } from "react";
import { FiLink, FiLock, FiCopy, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function WorkspaceCards() {
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState(
    `${window.location.origin}/workspace?pin=######`,
  );
  const [copied, setCopied] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef([]);

  const handleCopy = () => {
    if (roomUrl.includes("######")) return;
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateLink = async () => {
    try {
      const response = await api.post("/rooms/create");
      const { pin } = response.data;
      setRoomUrl(`${window.location.origin}/workspace?pin=${pin}`);
      navigate(`/workspace?pin=${pin}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newPin = [...pin];
      digits.forEach((digit, i) => {
        newPin[i] = digit;
      });
      setPin(newPin);
      const nextIndex = Math.min(digits.length, 5);
      pinRefs.current[nextIndex]?.focus();
    }
  };

  const handleJoinSession = async () => {
    const fullPin = pin.join("");
    if (fullPin.length === 6) {
      try {
        await api.post("/rooms/verify", { pin: fullPin });
        navigate(`/workspace?pin=${fullPin}`);
      } catch (error) {
        console.error("Invalid PIN or unauthorized:", error);
        setPin(["", "", "", "", "", ""]); // Clears the boxes on failure
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Collaborative Real-time Workspace
        </h1>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          Host a new coding session instantly or enter a room code to join
          active teammates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host Session Card */}
        <div className="bg-[#0b0f15]/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <FiLink size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Host a New Session
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                  Generate a shareable, secure URL for real-time multiplayer
                  code editing.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#06080c] border border-zinc-800 rounded-xl px-4 py-3 mb-6">
              <span className="text-sm font-mono text-zinc-400 truncate select-all">
                {roomUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-zinc-400 hover:text-zinc-200 transition-colors ml-3 p-1 shrink-0"
                title="Copy to clipboard"
              >
                {copied ? (
                  <FiCheck className="text-emerald-400" size={16} />
                ) : (
                  <FiCopy size={16} />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateLink}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-blue-600/20 active:scale-[0.99]"
          >
            Generate Room Link
          </button>
        </div>

        {/* Join Session Card */}
        <div className="bg-[#0b0f15]/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <FiLock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Join via Room Code
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                  Enter the 6-digit numeric PIN provided by the workspace host.
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-6 gap-2 sm:gap-3 mb-6"
              onPaste={handlePinPaste}
            >
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (pinRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="•"
                  className={`w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl bg-[#06080c] border transition-all duration-150 text-white placeholder-zinc-700 outline-none ${
                    digit
                      ? "border-blue-500/80 ring-1 ring-blue-500/40"
                      : "border-zinc-800 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/40"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleJoinSession}
            disabled={pin.join("").length !== 6}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-blue-600/20 active:scale-[0.99]"
          >
            Join Active Session
          </button>
        </div>
      </div>
    </div>
  );
}
