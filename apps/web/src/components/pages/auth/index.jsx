import { logIn, logOut, useAuthStore } from "../../../stores/auth-store"

function Auth() {
  const token = useAuthStore((state) => state.token)

  return (
    <div>
      <button onClick={() => logIn('alice@example.com', 6062)}>Log in</button>
      <button onClick={() => logOut()}>Log out</button>
      From Auth!
      {token}
    </div>
  )
}

export default Auth