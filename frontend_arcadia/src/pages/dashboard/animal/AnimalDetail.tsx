import { JSX } from 'react'
import {
    PawPrint
} from "lucide-react"
import { useParams } from 'react-router-dom'
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function AnimalDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    return (
        <>
            <DashboardPageHeader 
                icon={<PawPrint size={30} />}
                title="Détail de l'animal"
            />
            <p>UUID : <code>{uuid}</code></p>
        </>
    )
}