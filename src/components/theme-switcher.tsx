
"use client";

import { motion } from "framer-motion";
import { Check, Palette, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const themes = [
  {
    name: "NeoCyber",
    id: "theme-neocyber",
    colors: ["bg-purple-500", "bg-pink-500", "bg-cyan-400"],
  },
  {
    name: "Starlight",
    id: "theme-starlight",
    colors: ["bg-blue-400", "bg-sky-300", "bg-gray-300"],
  },
  {
    name: "Crimson Flare",
    id: "theme-crimson-flare",
    colors: ["bg-red-600", "bg-orange-500", "bg-yellow-400"],
  },
];

export function ThemeSwitcher({ onClose }: { onClose: () => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-border shadow-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Select a Theme</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {themes.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="cursor-pointer"
                  onClick={() => setTheme(t.id as any)}
                >
                  <Card className={`overflow-hidden transition-all duration-300 ${theme === t.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-accent"}`}>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-foreground">{t.name}</h3>
                        {theme === t.id && <Check className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        {t.colors.map((color, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full ${color}`} />
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
