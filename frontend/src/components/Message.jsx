// src/components/Message.jsx
import React from "react";
import { MotionConfig, motion } from "framer-motion";
import { User, RocketIcon } from "lucide-react";

export default function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`max-w-[80%] ${isUser ? "ml-auto text-right" : "mr-auto text-left"}`}
    >
      <div className={`inline-flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="p-2 rounded-full bg-slate-800/60">
          {isUser ? <User size={18} /> : <RocketIcon size={18} />}
        </div>
        <div className={`px-4 py-3 rounded-2xl wrap-break-word ${isUser ? "bg-linear-to-br from-indigo-600 to-violet-500 text-white" : "bg-slate-100 text-slate-900"}`}>
          <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, "<br>") }} />
          {message.meta && (
            <div className="mt-2 text-xs text-slate-500">{message.meta}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
