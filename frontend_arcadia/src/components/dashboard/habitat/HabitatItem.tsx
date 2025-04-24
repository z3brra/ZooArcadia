import { JSX } from "react"
import {
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions
} from "../Card"
import { Ellipsis } from "lucide-react"

export type HabitatItemProps = {
    imageUrl: string
    name: string
    animalCount: number
}

export function HabitatItem({
    imageUrl,
    name,
    animalCount
}: HabitatItemProps): JSX.Element {
    return (
        <Card>
            <div className="dashboard-card-body">
                <CardMedia src={imageUrl} className="media-rounded"/>
                <div className="dashboard-card-item">
                    <CardHeader className="text-bigcontent text-primary">{name}</CardHeader>
                    <CardContent className="text-small text-silent">{`Nombre d'animaux : ${animalCount}`}</CardContent>
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