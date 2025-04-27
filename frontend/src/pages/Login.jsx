const handleLogin = async (e) => {
  e.preventDefault()
  try {
    const response = await axios.post('https://nublia-backend.onrender.com/login',
      new URLSearchParams({
        username: email,
        password: senha
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    const { user, access_token } = response.data

    // Salva token e usuário no localStorage
    localStorage.setItem("token", access_token)
    localStorage.setItem("user", JSON.stringify(user))

    if (onLogin) {
      onLogin(user)
    }

    // Redireciona conforme o tipo de usuário
    if (user.role === "admin") {
      navigate("/admin", { replace: true })
    } else if (user.role === "prescritor") {
      navigate("/prescritor", { replace: true })
    } else {
      navigate("/", { replace: true })
    }

    // 🆕 FORÇA RECARREGAMENTO IMEDIATO para corrigir tela branca
    setTimeout(() => {
      window.location.reload()
    }, 100)

  } catch (error) {
    console.error(error)
    setErro("Email ou senha inválidos.")
  }
}
