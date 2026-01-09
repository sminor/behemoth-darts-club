import Link from "next/link";
import { Mail, Facebook } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/10 bg-black/20 py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
                <p className="text-neutral-400 text-sm">
                    &copy; {currentYear} Behemoth Darts Club. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <a
                        href="mailto:behemothdartsclub@gmail.com"
                        className="text-neutral-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 text-sm"
                    >
                        <Mail className="w-4 h-4" />
                        <span>Contact Us</span>
                    </a>
                    <a
                        href="https://www.facebook.com/groups/597239589917492/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 text-sm"
                    >
                        <Facebook className="w-4 h-4" />
                        <span>Facebook</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
