import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DASHBOARD_ROUTES } from "@routes/paths"

import { Activity } from "@models/activity"
import { fetchOneActivity, deleteActivity } from "@services/activityService"

export function useActivityDetail() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const loadActivity = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const activityResponse = await fetchOneActivity(uuid)
            setActivity(activityResponse)
            if (!activityResponse) {
                setNotFound(true)
            }
        } catch {
            setError("Impossible de charger l'activité")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    useEffect(() => {
        loadActivity()
    }, [loadActivity])

    const removeActivity = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await deleteActivity(uuid)
            navigate(DASHBOARD_ROUTES.ACTIVITES.TO)
        } catch {
            setError("Impossible de supprimer l'activité")
        } finally {
            setLoading(false)
        }
    }, [uuid, navigate])

    return {
        activity,
        loading,
        error, setError,
        notFound,
        removeActivity
    }
}