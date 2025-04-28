import { JSX, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '@routes/paths'

import {
    PencilRuler,
    SquarePen,
    Trash2,
    PawPrint
} from "lucide-react"

import { Specie } from '@models/species'
import { AnimalListItem } from '@models/animal'

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { 
    Card,
    CardHeader,
    CardContent
} from '@components/dashboard/Card'

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'
import { Dropdown, DropdownItem, DropdownLabel } from '@components/common/Dropdown'
import { CommonLink } from '@components/common/CommonLink'

import { getRequest, deleteRequest } from '@api/request'
import { Endpoints } from '@api/endpoints'

import { formatDiet } from '@utils/formatters'

export function SpeciesDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [showDelete, setShowDelete] = useState<boolean>(false)

    const [specie, setSpecie] = useState<Specie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [animalsLoading, setAnimalsLoading] = useState<boolean>(false)
    const [animalsError, setAnimalsError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSpecie = async () => {
            setLoading(true)
            setError(null)
            try {
                const specieResponse = await getRequest<Specie>(
                    `${Endpoints.SPECIES}/${uuid}`
                )
                setSpecie(specieResponse)
                if (!specieResponse) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching specie ", errorResponse)
                setError("Impossible de charger l'espèce")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fetchSpecie()
        }
    }, [uuid])

    useEffect(() => {
        if (!specie) {
            return
        }
        const fetchAnimals = async () => {
            setAnimalsLoading(true)
            setAnimalsError(null)
            try {
                const animalsResponse = await getRequest<AnimalListItem[]>(
                    `${Endpoints.SPECIES}/${uuid}/animals?limit=4`
                )
                setAnimals(animalsResponse)
            } catch (errorResponse) {
                console.error("Error when fetching animals ", errorResponse)
                setAnimalsError("Impossible de charger les animaux")
            } finally {
                setAnimalsLoading(false)
            }
        }
        if (specie) {
            fetchAnimals()
        }
    }, [specie, uuid])

    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        try {
            await deleteRequest<void>(
                `${Endpoints.SPECIES}/${uuid}`
            )
        } catch (errorResponse) {
            console.error("Error when delete habitat ", errorResponse)
            setError("Impossible de supprimer l'espèce animale.")
        } finally {
            setLoading(false)
            setShowDelete(false)
            navigate(DASHBOARD_ROUTES.SPECIES.TO)
        }
    }

    return (
        <>
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader 
                icon={<PencilRuler size={30} />}
                title="Détail de l'espèce"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<SquarePen size={20} />}
                    onClick={() => console.log('Modifier')}
                    className="text-content"
                >
                    Modifier
                </Button>
                <Button
                    variant="delete"
                    icon={<Trash2 size={20} />}
                    onClick={() => setShowDelete(true)}
                    className="text-content"
                >
                    Supprimer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucune espèce trouvée" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && specie && (
                <DashboardSection className="specie-content">
                    <Card orientation="vertical" className="specie-content-infos">
                        <div className="dashboard-card-item">
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Nom commun</CardContent>
                                <CardContent className="text-content text-primary">{specie.commonName}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Nom scientifique</CardContent>
                                <CardContent className="text-content text-primary">{specie.scientificName}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Durée de vie</CardContent>
                                <CardContent className="text-content text-primary">{specie.lifespan}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Régime alimentaire</CardContent>
                                <CardContent className="text-content text-primary">{formatDiet(specie.diet)}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Description</CardContent>
                                <CardContent className="text-content text-primary">{specie.description}</CardContent>
                            </div>
                        </div>
                    </Card>

                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Animaux de cette espèce</CardHeader>
                            <CardContent className="text-small text-silent">{`Animaux : ${specie.animalCount}`}</CardContent>
                        </div>
                        <Dropdown triggerText="Voir les animaux">
                            { animalsError && (
                                <MessageBox variant="error" message={animalsError} onClose={() => setAnimalsError(null)} />
                            )}

                            { !animalsLoading && !animalsError && animals.map(animal => (
                                <div key={animal.uuid} className="dropdown-item">
                                    <DropdownItem
                                        leftItems={[
                                            { icon: <PawPrint size={20} />, text: animal.name, itemClassName: "text-content text-primary"},
                                            { icon: <PencilRuler size={20} />, text: animal.speciesName, itemClassName: "text-content text-silent"}
                                        ]}
                                    />
                                    <DropdownLabel variant="grey" label='Aucun statut' />
                                </div>
                            ))}
                            <CommonLink to={DASHBOARD_ROUTES.ANIMALS.TO} text="Voir tout les animaux" />
                        </Dropdown>
                    </Card>
                </DashboardSection>
            )}

            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer l'espèce animale ?"
                message="Cette action est irréversible. Cela supprimera l'espèce animale et toutes les données associées."
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />

        </>
    )
}