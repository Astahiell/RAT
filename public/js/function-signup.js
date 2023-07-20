let loginInput = document.getElementById("login");
let passwordInput = document.getElementById("password");
let passwordInput2 = document.getElementById("password");
let signupButton = document.getElementById("signup");

const signup = async () => {
  const login = loginInput.value;
  const password = passwordInput.value;
  const password2 = passwordInput2.value;

  try {
    const { data } = await axios.post("/api/v1/signup", {
      login,
      password,
    });
  } catch (err) {
    console.log(err);
  }
};
