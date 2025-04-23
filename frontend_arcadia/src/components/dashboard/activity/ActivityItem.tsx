import { JSX } from "react"
import {
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions
} from "../Card"
import { Ellipsis } from "lucide-react"

import { sliceText } from "../../../utils/sliceText"

export type ActivityItemProps = {
    imageUrl: string
    name: string
    description: string
}

export function ActivityItem({
    imageUrl,
    name,
    description
}: ActivityItemProps): JSX.Element {
    const slicedDescription = sliceText(description, 70)

    return (
        <Card>
            <div className="dashboard-card-body">
                <CardMedia src={imageUrl} className="media-rounded"/>
                <div className="dashboard-card-item">
                    <CardHeader className="text-bigcontent text-primary">{name}</CardHeader>
                    <CardContent className="text-small text-silent">{slicedDescription}</CardContent>
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