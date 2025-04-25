import { JSX } from "react"
import { MessagesSquare } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function Reviews (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<MessagesSquare size={30} />}
            title="Commentaires"
            description="Gérer et visualiser vos commentaires"
        />
    )
}