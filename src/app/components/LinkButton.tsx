"use client";

import Link from "next/link";

import { Button } from "@nextui-org/react";

export default function LinkButton(props: {
  to: string;
  text: string;
  className: string;
}) {
  return (
    <Button
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
