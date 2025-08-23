// src/components/ShippingForm.jsx
import React from "react";

export default function ShippingForm({ value, onChange, errors = {} }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Nombre */}
      <div className="form-control md:col-span-2">
        <label className="label"><span className="label-text">Nombre completo *</span></label>
        <input
          className={`input input-bordered ${errors.fullName ? "input-error" : ""}`}
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          placeholder="Nombre y apellidos"
        />
        {errors.fullName && <span className="text-error text-sm mt-1">{errors.fullName}</span>}
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label"><span className="label-text">Correo electrónico *</span></label>
        <input
          type="email"
          className={`input input-bordered ${errors.email ? "input-error" : ""}`}
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="tucorreo@ejemplo.com"
        />
        {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
      </div>

      {/* Tel (opcional) */}
      <div className="form-control">
        <label className="label"><span className="label-text">Teléfono (opcional)</span></label>
        <input
          className="input input-bordered"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+52 55 1234 5678"
        />
      </div>

      {/* País */}
      <div className="form-control">
        <label className="label"><span className="label-text">País *</span></label>
        <input
          className={`input input-bordered ${errors.country ? "input-error" : ""}`}
          value={value.country}
          onChange={(e) => set("country", e.target.value)}
          placeholder="MX"
        />
        {errors.country && <span className="text-error text-sm mt-1">{errors.country}</span>}
      </div>

      {/* Estado */}
      <div className="form-control">
        <label className="label"><span className="label-text">Estado/Provincia *</span></label>
        <input
          className={`input input-bordered ${errors.state ? "input-error" : ""}`}
          value={value.state}
          onChange={(e) => set("state", e.target.value)}
          placeholder="CDMX, Jalisco, ..."
        />
        {errors.state && <span className="text-error text-sm mt-1">{errors.state}</span>}
      </div>

      {/* Ciudad */}
      <div className="form-control">
        <label className="label"><span className="label-text">Ciudad *</span></label>
        <input
          className={`input input-bordered ${errors.city ? "input-error" : ""}`}
          value={value.city}
          onChange={(e) => set("city", e.target.value)}
          placeholder="Ciudad"
        />
        {errors.city && <span className="text-error text-sm mt-1">{errors.city}</span>}
      </div>

      {/* Colonia */}
      <div className="form-control">
        <label className="label"><span className="label-text">Colonia / Barrio</span></label>
        <input
          className="input input-bordered"
          value={value.neighborhood}
          onChange={(e) => set("neighborhood", e.target.value)}
          placeholder="Colonia/Barrio"
        />
      </div>

      {/* Calle */}
      <div className="form-control md:col-span-2">
        <label className="label"><span className="label-text">Calle *</span></label>
        <input
          className={`input input-bordered ${errors.street ? "input-error" : ""}`}
          value={value.street}
          onChange={(e) => set("street", e.target.value)}
          placeholder="Nombre de la calle"
        />
        {errors.street && <span className="text-error text-sm mt-1">{errors.street}</span>}
      </div>

      {/* Números */}
      <div className="form-control">
        <label className="label"><span className="label-text">Número exterior *</span></label>
        <input
          className={`input input-bordered ${errors.extNumber ? "input-error" : ""}`}
          value={value.extNumber}
          onChange={(e) => set("extNumber", e.target.value)}
          placeholder="123"
        />
        {errors.extNumber && <span className="text-error text-sm mt-1">{errors.extNumber}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Número interior</span></label>
        <input
          className="input input-bordered"
          value={value.intNumber}
          onChange={(e) => set("intNumber", e.target.value)}
          placeholder="Depto, piso…"
        />
      </div>

      {/* CP */}
      <div className="form-control">
        <label className="label"><span className="label-text">Código postal *</span></label>
        <input
          className={`input input-bordered ${errors.postalCode ? "input-error" : ""}`}
          value={value.postalCode}
          onChange={(e) => set("postalCode", e.target.value)}
          placeholder="00000"
        />
        {errors.postalCode && <span className="text-error text-sm mt-1">{errors.postalCode}</span>}
      </div>

      {/* Referencias */}
      <div className="form-control md:col-span-2">
        <label className="label"><span className="label-text">Referencias (opcional)</span></label>
        <textarea
          className="textarea textarea-bordered min-h-[90px]"
          value={value.references}
          onChange={(e) => set("references", e.target.value)}
          placeholder="Color de puerta, punto de entrega, horario…"
        />
      </div>
    </div>
  );
}
