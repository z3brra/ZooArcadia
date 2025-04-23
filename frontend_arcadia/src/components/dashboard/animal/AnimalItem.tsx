import { JSX } from "react"
import {
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions
} from "../Card"
import { Ellipsis } from "lucide-react"

export type AnimalItemProps = {
    imageUrl: string
    name: string
    species: string
    habitat: string
}

export function AnimalItem({
    imageUrl,
    name,
    species,
    habitat
}: AnimalItemProps): JSX.Element {
    return (
        <Card>
            <div className="dashboard-card-body">
                <CardMedia src={imageUrl} className="media-rounded" />
                <div className="dashboard-card-item">
                    <CardHeader className="text-bigcontent text-primary">{name}</CardHeader>
                    <CardContent className="text-small text-silent">{species}</CardContent>
                    <CardContent className="text-small text-silent">{habitat}</CardContent>
                </div>
            </div>
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
