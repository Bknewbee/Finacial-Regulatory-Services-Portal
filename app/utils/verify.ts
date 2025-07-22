export const checkMe = async () => {
  const res = await fetch("/api/auth/me");
  const data = await res.json();
  console.log(data);
  if (data.isAuthenticated) {
    //setUser({ name: data.name, email: data.email });
    return { name: data.name, email: data.email };
  } else {
    // setUser(null);
    return null;
  }
};
