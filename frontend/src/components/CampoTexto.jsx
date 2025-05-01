// src/components/CampoTexto.jsx
export default function CampoTexto({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`input-base ${className}`}
      {...props}
    />
  )
}
