import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const { themeChoice, setThemeChoice } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const themes = [
        { value: "light", label: "Light", icon: Sun },
        { value: "dark", label: "Dark", icon: Moon },
        { value: "system", label: "System", icon: Monitor },
    ] as const;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentTheme = themes.find((t) => t.value === themeChoice) || themes[2];
    const CurrentIcon = currentTheme.icon;

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle theme"
                className="relative"
            >
                <CurrentIcon className="h-5 w-5 transition-transform hover:rotate-12" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-md shadow-lg py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                        Theme
                    </div>
                    {themes.map((theme) => {
                        const Icon = theme.icon;
                        const isSelected = themeChoice === theme.value;

                        return (
                            <button
                                key={theme.value}
                                onClick={() => {
                                    setThemeChoice(theme.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${isSelected
                                        ? "bg-accent text-accent-foreground font-medium"
                                        : "text-foreground hover:bg-accent/50"
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{theme.label}</span>
                                </div>
                                {isSelected && <Check className="h-4 w-4" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
