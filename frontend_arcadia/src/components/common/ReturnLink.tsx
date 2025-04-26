import { JSX } from "react"
// import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { CornerDownLeft } from "lucide-react"

export type ReturnButtonProps = {
    text?: string
}

export function ReturnButton({
    text
}: ReturnButtonProps): JSX.Element {

    return (
        <>
            <Link
                to=".."
                relative="path"
                className="return-link text-small text-silent"
            >
                <div className="return-link-item">
                    <CornerDownLeft size={20} />
                    <p>{text ? text : 'Retour'}</p>
                </div>
            </Link>
        </>
    )
}