// src/components/Botao.jsx
export default function Botao({
  texto,
  iconeInicio,
  children,
  type = "button",
  onClick,
  full = true,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary flex items-center justify-center gap-2 ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {iconeInicio}
      {texto || children}
    </button>
  )
}
