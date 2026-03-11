"use client";
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { signOut } = useClerk();
  
  return (
    <button 
      onClick={() => signOut({ redirectUrl: "/login" })}
      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
    >
      <LogOut size={16} /> Sair
    </button>
  );
}