import { JSX } from 'react'
import {
    PencilRuler
} from "lucide-react"
import { useParams } from 'react-router-dom'
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function SpeciesDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    return (
        <>
            <DashboardPageHeader 
                icon={<PencilRuler size={30} />}
                title="Détail de l'espèce"
            />
            <p>UUID : <code>{uuid}</code></p>
        </>
    )
}