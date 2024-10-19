"use client";

import { useUser, SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignInButton mode="modal">
      <Button variant="secondary">Sign In</Button>
    </ClerkSignInButton>
  );
}
