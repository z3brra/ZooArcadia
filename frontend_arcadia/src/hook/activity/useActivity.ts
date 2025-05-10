import { useState, useCallback, useEffect } from "react"
import { fetchActivities, createActivity } from "@services/activityService"
import { ActivityListItem, ActivityCreate } from "@models/activity"
import { validateActivity } from "@utils/validation"

export function useActivities(initialPage = 1) {
    const [activities, setActivites] = useState<ActivityListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const [activityName, setActivityName] = useState<string>("")
    const [activityDescription, setActivityDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        activityName?: string
        activityDescription?: string
    }>({})

    const loadActivities = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const activitiesResponse = await fetchActivities(currentPage)
            setActivites(activitiesResponse.data)
            setTotalPages(activitiesResponse.totalPages)
        } catch {
            setError("Impossible de charger la liste des activités")
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        loadActivities()
    }, [loadActivities])

    const addActivity = useCallback(async (payload: ActivityCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createActivity(payload)
            setCurrentPage(1)

            setActivityName("")
            setActivityDescription("")

            await loadActivities()
        } catch {
            setError("Impossible de créer l'activité")
        } finally {
            setLoading(false)
        }
    }, [loadActivities])

    const submitCreation = useCallback(async (activityName: string, activityDescription: string) => {
        const errors = validateActivity(activityName, activityDescription)
        setFieldErrors({
            activityName: errors.name,
            activityDescription: errors.description
        })
        if (Object.keys(errors).length) {
            return false
        }
        setLoading(true)
        setError(null)
        const payload: ActivityCreate = {
            name: activityName.trim(),
            description: activityDescription.trim() || null
        }
        await addActivity(payload)
        setFieldErrors({})
        return true
    }, [addActivity])

    return {
        activities,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError,
        activityName, setActivityName,
        activityDescription, setActivityDescription,
        fieldErrors,
        submitCreation
    }
}
