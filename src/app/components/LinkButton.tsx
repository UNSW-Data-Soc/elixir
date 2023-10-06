"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function LinkButton(props: {
    to: string;
    text: string;
    className: string;
}) {
    return (
        <>
            <Button
                as={Link}
                color="primary"
                href={props.to}
                variant="solid"
                className={props.className}
            >
                <span>{props.text}</span>
            </Button>
        </>
    );
}
