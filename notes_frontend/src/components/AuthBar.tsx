import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

interface AuthBarProps {
  user: { name: string; email: string } | null;
  onAuthQrl: PropFunction<(action: "login" | "logout") => void>;
}

export const AuthBar = component$((props: AuthBarProps) => {
  return (
    <div class="authbar">
      {props.user ? (
        <>
          <span class="user">{props.user.name}</span>
          <button class="auth-btn" onClick$={() => props.onAuthQrl("logout")}>Logout</button>
        </>
      ) : (
        <button class="auth-btn" onClick$={() => props.onAuthQrl("login")}>Login</button>
      )}
    </div>
  );
});
