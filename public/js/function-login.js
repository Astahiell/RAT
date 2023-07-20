let loginInput = document.getElementById("login");
let passwordInput = document.getElementById("password");
let loginButton = document.getElementById("login");

const login = async () => {
  const login = loginInput.value;
  const password = passwordInput.value;

  try {
    const { data } = await axios.post("/api/v1/users/authenticate", {
      login,
      password,
    });
    sessionStorage.setItem("username", data.login);
    sessionStorage.setItem("token", data.token);
    window.location.href = `/routes`;
  } catch (err) {
    console.log(err);
  }
};
