import { JSX } from "react"
import { Link } from "react-router-dom"
import {
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions
} from "@components/dashboard/Card"
import { Ellipsis } from "lucide-react"

export type HabitatItemProps = {
    uuid: string
    imageUrl: string
    name: string
    animalCount: number
}

export function HabitatItem({
    uuid,
    imageUrl,
    name,
    animalCount
}: HabitatItemProps): JSX.Element {
    return (
        <Card>
            <Link
                key={uuid}
                to={`${uuid}`}
                className="dashboard-card-link"
            >
                <div className="dashboard-card-body">
                    <CardMedia src={imageUrl} className="media-rounded"/>
                    <div className="dashboard-card-item">
                        <CardHeader className="text-bigcontent text-primary">{name}</CardHeader>
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