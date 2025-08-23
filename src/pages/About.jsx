// src/pages/About.jsx
import { useEffect, useState } from "react";
import { fetchAbout } from "../services/cmsService";

export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const d = await fetchAbout();
      setData(d);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Cargando…</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {data?.heroImageUrl && (
        <div className="w-full aspect-[16/9] rounded-box overflow-hidden bg-base-200">
          <img src={data.heroImageUrl} alt="Acerca de" className="w-full h-full object-cover" />
        </div>
      )}
      <div>
        <h1 className="text-4xl font-bold">{data?.title || "Acerca de"}</h1>
        {data?.subtitle && <p className="opacity-70 mt-1">{data.subtitle}</p>}
      </div>
      <div className="prose max-w-none whitespace-pre-wrap">{data?.body}</div>
    </div>
  );
}
