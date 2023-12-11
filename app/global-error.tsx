'use client';

import Placeholder from "@/components/placeholder";

interface ErrorAlertProps {
  error: Error;
  reset: () => void;
}

export default function ErrorAlert({ error, reset }: ErrorAlertProps) {
  return (
    <Placeholder title="Произошла ошибка 😳" description={error.message} />
  );
}
