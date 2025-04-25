import { JSX } from 'react'
import {
    LandPlot
} from "lucide-react"
import { useParams } from 'react-router-dom'
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function ActivityDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    return (
        <>
            <DashboardPageHeader 
                icon={<LandPlot size={30} />}
                title="Détail de l'activité"
            />
            <p>UUID : <code>{uuid}</code></p>
        </>
    )
}