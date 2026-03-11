// web/app/components/admin/PaymentStatusToggle.tsx
"use client";
import { useState } from "react";

export default function PaymentStatusToggle({ classId, initialStatus }: { classId: string, initialStatus: boolean }) {
  const [isPaid, setIsPaid] = useState(initialStatus);

  const toggleStatus = async () => {
    // Aqui chamaria sua API para atualizar no Prisma
    setIsPaid(!isPaid);
  };

  return (
    <button 
      onClick={toggleStatus}
      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
        isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isPaid ? "● Pago via PIX" : "○ Pendente / Aguardando"}
    </button>
  );
}