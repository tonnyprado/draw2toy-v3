// src/pages/FAQ.jsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";

const PAGE = 200;

export default function FAQ() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "faqs"), orderBy("order", "asc"), limit(PAGE));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filtra en cliente si quieres ocultar no publicados (evita índice compuesto)
      setRows(list.filter(x => !!x.published));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Cargando…</div>;

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Preguntas frecuentes</h1>

      <div className="join join-vertical w-full">
        {rows.length === 0 ? (
          <div className="opacity-70">No hay preguntas por ahora.</div>
        ) : (
          rows.map((faq, idx) => (
            <div key={faq.id} className="collapse collapse-plus join-item border border-base-300">
              <input type="checkbox" defaultChecked={idx === 0} />
              <div className="collapse-title text-lg font-medium">{faq.question}</div>
              <div className="collapse-content whitespace-pre-wrap">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
