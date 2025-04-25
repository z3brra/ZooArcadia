import { JSX } from "react"
import { Link } from "react-router-dom"
import {
    Card,
    CardHeader,
    CardContent,
    CardActions
} from "../Card"
import { Ellipsis } from "lucide-react"

export type SpeciesItemProps = {
    uuid: string
    commonName: string,
    scientificName: string
    animalCount: number
}

export function SpeciesItem({
    uuid,
    commonName,
    scientificName,
    animalCount
}: SpeciesItemProps): JSX.Element {
    return (
        <Card>
            <Link
                key={uuid}
                to={`${uuid}`}
                className="dashboard-card-link"
            >
                <div className="dashboard-card-body">
                    <div className="dashboard-card-item">
                        <CardHeader className="text-bigcontent text-primary">{commonName}</CardHeader>
                        <CardContent className="text-small text-silent">{scientificName}</CardContent>
                        <CardContent className="text-small text-silent">{`Nombre d'animaux : ${animalCount}`}</CardContent>
                    </div>
                </div>
            </Link>
            <CardActions>
                <button
                    type="button"
                    className="dashboard-card-ellipsis text-silent"
                    onClick={() => console.log("Ouvrir menu...")}
                >
                    <Ellipsis size={30} />
                </button>
            </CardActions>
        </Card>
    )
}