
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Lock,
  Eye,
  Zap,
  Sparkles,
  Shield,
  Brain,
  CheckCircle,
  X,
  MessageSquare,
  Trash2,
  Download,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatInterface } from "./components/ChatInterface";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: string;
  uploadTime: string;
  isLocked: boolean;
  password?: string;
  summary?: string;
  isProcessing?: boolean;
  isUploaded: boolean;
  chatHistory?: any[];
}

// Global storage key
const STORAGE_KEY = "legal_pdf_assistant_files";

export default function LegeztPDFAIPage() {
  const [uploadedPDFs, setUploadedPDFs] = useState<PDFFile[]>(
    [],
  );
  const [selectedPDF, setSelectedPDF] =
    useState<PDFFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [showChatInterface, setShowChatInterface] =
    useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [processingProgress, setProcessingProgress] =
    useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDFs from localStorage on component mount
  useEffect(() => {
    const savedPDFs = localStorage.getItem(STORAGE_KEY);
    if (savedPDFs) {
      try {
        const parsedPDFs = JSON.parse(savedPDFs);
        setUploadedPDFs(
          parsedPDFs.map((pdf: any) => ({
            ...pdf,
            file: new File([], pdf.name, {
              type: "application/pdf",
            }), // Create dummy file object
          })),
        );
      } catch (error) {
        console.error(
          "Error loading PDFs from storage:",
          error,
        );
      }
    }
  }, []);

  // Save PDFs to localStorage whenever uploadedPDFs changes
  useEffect(() => {
    const pdfsToSave = uploadedPDFs.map((pdf) => ({
      id: pdf.id,
      name: pdf.name,
      size: pdf.size,
      uploadTime: pdf.uploadTime,
      isLocked: pdf.isLocked,
      password: pdf.password,
      summary: pdf.summary,
      isProcessing: pdf.isProcessing,
      isUploaded: pdf.isUploaded,
      chatHistory: pdf.chatHistory || [],
    }));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(pdfsToSave),
    );
  }, [uploadedPDFs]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf") {
        const newPDF: PDFFile = {
          id:
            Date.now().toString() +
            Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          size: formatFileSize(file.size),
          uploadTime: new Date().toLocaleString(),
          isLocked: false,
          isUploaded: false,
          chatHistory: [],
        };
        setUploadedPDFs((prev) => [...prev, newPDF]);
        setSelectedPDF(newPDF);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleLockPDF = () => {
    if (selectedPDF) {
      const updatedPDF = {
        ...selectedPDF,
        isLocked: true,
        password: lockPassword,
      };
      setUploadedPDFs((prev) =>
        prev.map((pdf) =>
          pdf.id === selectedPDF.id ? updatedPDF : pdf,
        ),
      );
      setSelectedPDF(updatedPDF);
      setShowLockDialog(false);
      setLockPassword("");
    }
  };

  const handleAIProcessing = async () => {
    if (!selectedPDF) return;

    const updatedPDF = { ...selectedPDF, isProcessing: true };
    setSelectedPDF(updatedPDF);
    setUploadedPDFs((prev) =>
      prev.map((pdf) =>
        pdf.id === selectedPDF.id ? updatedPDF : pdf,
      ),
    );

    // Simulate AI processing
    for (let i = 0; i <= 100; i += 10) {
      setProcessingProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Simulate AI summary in English
    const mockSummary = `This is a legal document containing the following key points:

• Contract terms and conditions
• Rights and obligations of parties  
• Payment terms and timeline
• Dispute resolution process
• Legal compliance requirements

Important Sections: Section 3.2 contains special terms and Section 7.1 contains termination clause.

🤖 You can now chat with AI about this document!`;

    const finalPDF = {
      ...updatedPDF,
      isProcessing: false,
      summary: mockSummary,
      isUploaded: true,
    };
    setSelectedPDF(finalPDF);
    setUploadedPDFs((prev) =>
      prev.map((pdf) =>
        pdf.id === selectedPDF.id ? finalPDF : pdf,
      ),
    );
    setProcessingProgress(0);
  };

  const handleDeletePDF = (pdfToDelete: PDFFile) => {
    setUploadedPDFs((prev) =>
      prev.filter((pdf) => pdf.id !== pdfToDelete.id),
    );
    if (selectedPDF?.id === pdfToDelete.id) {
      setSelectedPDF(null);
    }
  };

  const handleChatWithAI = () => {
    if (selectedPDF?.isUploaded) {
      setShowChatInterface(true);
    }
  };

  return (
    <>
      {/* Anime-style background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900" />

        {/* Animated orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />

        {/* Stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Grid overlay - Fixed */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
                <path d="M0 0h50v50H0z" fill="none" stroke="#ffffff" stroke-width="0.5"/>
              </svg>
            `)}")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="relative min-h-screen p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.h1
              animate={{
                backgroundPosition: [
                  "0% 50%",
                  "100% 50%",
                  "0% 50%",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2 bg-[length:200%_auto]"
            >
              ✨ Legezt PDF AI Assistant ✨
            </motion.h1>
            <p className="text-white/80 text-lg">
              Upload, secure, and chat with your legal documents
              using AI
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Globe className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-cyan-300">
                Globally stored • Always accessible
              </span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - PDF Upload */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-6 h-6 text-cyan-300" />
                  <h2 className="text-2xl font-semibold text-white">
                    PDF Upload
                  </h2>
                </div>

                {/* Upload Area */}
                <motion.div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    isDragging
                      ? "border-cyan-400 bg-cyan-400/10 scale-105 shadow-lg shadow-cyan-400/25"
                      : "border-white/30 hover:border-cyan-400/50 hover:bg-white/5"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  whileHover={{
                    scale: isDragging ? 1.05 : 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) =>
                      handleFileUpload(e.target.files)
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: isDragging ? 360 : 0,
                        scale: isDragging ? 1.2 : 1,
                        y: [0, -10, 0],
                      }}
                      transition={{
                        rotate: { duration: 0.5 },
                        scale: { duration: 0.5 },
                        y: { duration: 2, repeat: Infinity },
                      }}
                    >
                      <Upload className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isDragging
                        ? "✨ Drop your PDF here! ✨"
                        : "📄 Upload PDF Files"}
                    </h3>
                    <p className="text-white/70 mb-4">
                      Drag & drop or click to select PDF files
                    </p>
                    <Button
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </motion.div>

                {/* Uploaded Files List */}
                {uploadedPDFs.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">
                        Uploaded Files ({uploadedPDFs.length})
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-cyan-300 text-cyan-300"
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Global Storage
                      </Badge>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <AnimatePresence>
                        {uploadedPDFs.map((pdf, index) => (
                          <motion.div
                            key={pdf.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all group ${
                              selectedPDF?.id === pdf.id
                                ? "border-cyan-400 bg-cyan-400/10 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-400/20"
                                : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10"
                            }`}
                            onClick={() => setSelectedPDF(pdf)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-red-400" />
                                <div>
                                  <p className="font-medium text-white">
                                    {pdf.name}
                                  </p>
                                  <p className="text-sm text-white/60">
                                    {pdf.size} •{" "}
                                    {pdf.uploadTime}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {pdf.isLocked && (
                                  <Shield className="w-4 h-4 text-green-400" />
                                )}
                                {pdf.isUploaded && (
                                  <Brain className="w-4 h-4 text-purple-400" />
                                )}
                                {pdf.isProcessing && (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                  >
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                  </motion.div>
                                )}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePDF(pdf);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Right Side - AI Processing */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 h-full bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="w-6 h-6 text-purple-300" />
                  <h2 className="text-2xl font-semibold text-white">
                    AI Assistant
                  </h2>
                </div>

                {selectedPDF ? (
                  <div className="space-y-6">
                    {/* Selected PDF Info */}
                    <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/30">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-cyan-300" />
                        <div>
                          <p className="font-semibold text-white">
                            {selectedPDF.name}
                          </p>
                          <p className="text-sm text-white/60">
                            {selectedPDF.size}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PDF Actions */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-white">
                        Available Actions
                      </h3>

                      {/* Lock PDF */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() =>
                            setShowLockDialog(true)
                          }
                          variant="outline"
                          className="w-full justify-start gap-3 h-14 border-2 border-white/20 hover:border-green-400/50 hover:bg-green-400/10 text-white"
                          disabled={selectedPDF.isLocked}
                        >
                          {selectedPDF.isLocked ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                          <div className="text-left">
                            <p className="font-medium">
                              {selectedPDF.isLocked
                                ? "PDF Secured"
                                : "Lock with Password"}
                            </p>
                            <p className="text-sm text-white/60">
                              {selectedPDF.isLocked
                                ? "Document is password protected"
                                : "Add password protection (optional)"}
                            </p>
                          </div>
                          {selectedPDF.isLocked && (
                            <Badge
                              variant="outline"
                              className="text-green-400 border-green-400"
                            >
                              Secured
                            </Badge>
                          )}
                        </Button>
                      </motion.div>

                      {/* View PDF */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-3 h-14 border-2 border-white/20 hover:border-blue-400/50 hover:bg-blue-400/10 text-white"
                        >
                          <Eye className="w-5 h-5" />
                          <div className="text-left">
                            <p className="font-medium">
                              View PDF
                            </p>
                            <p className="text-sm text-white/60">
                              Open document in viewer
                            </p>
                          </div>
                        </Button>
                      </motion.div>

                      {/* Upload to AI */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleAIProcessing}
                          variant="outline"
                          className="w-full justify-start gap-3 h-14 border-2 border-white/20 hover:border-purple-400/50 hover:bg-purple-400/10 text-white"
                          disabled={selectedPDF.isProcessing}
                        >
                          {selectedPDF.isProcessing ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="w-5 h-5 text-purple-400" />
                            </motion.div>
                          ) : (
                            <Zap className="w-5 h-5" />
                          )}
                          <div className="text-left">
                            <p className="font-medium">
                              {selectedPDF.isProcessing
                                ? "Processing..."
                                : "Upload to AI"}
                            </p>
                            <p className="text-sm text-white/60">
                              {selectedPDF.isProcessing
                                ? "Analyzing document"
                                : "Analyze and summarize document"}
                            </p>
                          </div>
                          {selectedPDF.isUploaded && (
                            <Badge
                              variant="outline"
                              className="text-purple-400 border-purple-400"
                            >
                              Analyzed
                            </Badge>
                          )}
                        </Button>
                      </motion.div>

                      {/* Chat with AI */}
                      {selectedPDF.isUploaded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={handleChatWithAI}
                            variant="outline"
                            className="w-full justify-start gap-3 h-14 border-2 border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10 text-white bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
                          >
                            <MessageSquare className="w-5 h-5 text-cyan-400" />
                            <div className="text-left">
                              <p className="font-medium">
                                💬 Chat with AI
                              </p>
                              <p className="text-sm text-white/60">
                                Ask questions about your
                                document
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-cyan-400 border-cyan-400 bg-cyan-400/10"
                            >
                              ✨ New
                            </Badge>
                          </Button>
                        </motion.div>
                      )}

                      {/* Processing Progress */}
                      {selectedPDF.isProcessing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          className="p-4 bg-purple-500/10 rounded-lg border border-purple-400/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-purple-300">
                              AI Analysis in Progress
                            </span>
                          </div>
                          <Progress
                            value={processingProgress}
                            className="w-full"
                          />
                          <p className="text-xs text-purple-300 mt-1">
                            {processingProgress}% complete
                          </p>
                        </motion.div>
                      )}

                      {/* AI Summary */}
                      {selectedPDF.summary && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-400/30"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-5 h-5 text-purple-400" />
                            <span className="font-semibold text-purple-300">
                              AI Summary
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none text-white/80 whitespace-pre-line text-sm leading-relaxed">
                            {selectedPDF.summary}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Brain className="w-16 h-16 text-white/40 mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white/70 mb-2">
                      No PDF Selected
                    </h3>
                    <p className="text-white/50">
                      Upload and select a PDF to start AI
                      analysis
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Lock Password Dialog */}
      <Dialog
        open={showLockDialog}
        onOpenChange={setShowLockDialog}
      >
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border-white/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Secure PDF with Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">
                Password (Optional)
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password to secure PDF"
                value={lockPassword}
                onChange={(e) =>
                  setLockPassword(e.target.value)
                }
                className="border-gray-300 focus:border-green-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleLockPDF}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Secure PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLockDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChatInterface && selectedPDF && (
          <ChatInterface
            pdfName={selectedPDF.name}
            onClose={() => setShowChatInterface(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
