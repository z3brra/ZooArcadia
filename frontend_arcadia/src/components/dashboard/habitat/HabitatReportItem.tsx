import { JSX } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardActions, CardLabel } from "@components/dashboard/Card"
import { Ellipsis } from "lucide-react"
import { formatDate, formatStateLabelVariant, formatStateLabel } from "@utils/formatters"


export type HabitatReportItemProps = {
    uuid: string
    habitatName: string
    reportDate: Date
    state: string
}

export function HabitatReportItem({
    uuid,
    habitatName,
    reportDate,
    state
}: HabitatReportItemProps): JSX.Element {
    return (
        <Card>
            <Link
                key={uuid}
                to={`${uuid}`}
                className="dashboard-card-link"
            >
                <div className="dashboard-card-body">
                    <div className="dashboard-card-item">
                        <CardHeader className="text-bigcontent text-primary">{habitatName}</CardHeader>
                        <CardContent className="text-small text-silent">{formatDate(reportDate)}</CardContent>
                        <CardLabel label={formatStateLabel(state)} variant={formatStateLabelVariant(state)}/>
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