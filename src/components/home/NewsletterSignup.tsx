"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { showToast } = useToast();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!emailPattern.test(normalizedEmail)) {
      setError("Saisissez une adresse e-mail valide.");
      return;
    }
    setError("");
    setEmail("");
    showToast("Merci, vous êtes inscrit(e).");
  }

  return (
    <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]" noValidate onSubmit={handleSubmit}>
      <Input
        autoComplete="email"
        error={error}
        id="home-newsletter-email"
        label="Votre adresse e-mail"
        name="email"
        onChange={(event) => {
          setEmail(event.target.value);
          if (error) setError("");
        }}
        placeholder="nom@exemple.com"
        type="email"
        value={email}
      />
      <Button className="self-end" type="submit">S’inscrire</Button>
    </form>
  );
}