import { JSX } from "react"

import { Link } from "react-router-dom"

export type CommonLinkProps = {
    to: string
    text: string
}

export function CommonLink({
    to,
    text
}: CommonLinkProps): JSX.Element {
    return (
        <>
            <Link
                to={to}
                // relative="path"
                className="common-link text-small"
            >
                {text}
            </Link>
        </>
    )
}