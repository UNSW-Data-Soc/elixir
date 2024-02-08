"use client";

import Link from "next/link";

import { Button } from "@nextui-org/react";

export default function LinkButton(props: {
  to: string;
  text: string;
  className: string;
  target?: string;
}) {
  return (
    <Button
      target={props.target}
      as={Link}
      color="primary"
      href={props.to}
      variant="solid"
      className={props.className}
    >
      {props.text}
    </Button>
  );
}
