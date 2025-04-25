import { JSX } from 'react'
import {
    Leaf
} from "lucide-react"
import { useParams } from 'react-router-dom'
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function HabitatDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    return (
        <>
            <DashboardPageHeader 
                icon={<Leaf size={30} />}
                title="Détail de l'habitat"
            />
            <p>UUID : <code>{uuid}</code></p>
        </>
    )
}