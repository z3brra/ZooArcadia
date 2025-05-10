import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { fetchOneActivity, updateActivity, updateActivityPicture, createRate, updateRate, deleteRate } from "@services/activityService"

import { validateActivity } from "@utils/validation"

import { Activity, ActivityUpdate, Rate, RateCreate, RateUpdate} from "@models/activity"
import { DraftRate } from "@components/dashboard/activity/RatesEditor"

export function useActivityEdit() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [activityName, setActivityName] = useState<string>("")
    const [activityDescription, setActivityDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        activityName?: string
        activityDescription?: string
    }>({})

    const [originalRates, setOriginalRates] = useState<Rate[]>([])
    const [draftRates, setDraftRates] = useState<DraftRate[]>([])

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
            setActivityName(activityResponse.name)
            setActivityDescription(activityResponse.description || "")

            setOriginalRates(activityResponse.rates ?? [])
            setDraftRates((activityResponse.rates ?? []).map(rate => ({ ...rate, status: "unchanged" })))
        } catch {
            setError("Impossible de charger l'activité")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    useEffect(() => {
        loadActivity()
    }, [loadActivity])

    const submitChange = useCallback(async () => {
        if (!uuid) {
            return
        }

        const errors = validateActivity(activityName, activityDescription)
        setFieldErrors({
            activityName: errors.name,
            activityDescription: errors.description
        })
        if (Object.keys(errors).length) {
            return
        }
        setLoading(true)
        setError(null)

        try {
            const payload: ActivityUpdate = {
                name: activityName.trim(),
                description: activityDescription.trim() || null
            }
            await updateActivity(uuid, payload)

            for (const rate of draftRates) {
                switch (rate.status) {
                    case "new":
                        const rateCreatePayload: RateCreate = {
                            title: rate.title,
                            price: rate.price,
                            activityUuid: uuid
                        }
                        await createRate(rateCreatePayload)
                        break

                    case "updated":
                        const rateUpdatePayload: RateUpdate = {
                            title: rate.title,
                            price: rate.price
                        }
                        await updateRate(rate.uuid, rateUpdatePayload)
                        break
                    case "deleted":
                        await deleteRate(rate.uuid)
                        break
                }
            }
            navigate(DASHBOARD_ROUTES.ACTIVITES.DETAIL(uuid))
        } catch {
            setError("Impossible de modifier l'activité")
        } finally {
            setLoading(false)
        }
    }, [activityName, activityDescription, draftRates, uuid, navigate])

    const uploadPicture = useCallback(async (file: File) => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await updateActivityPicture(uuid, file, activity?.pictures?.[0]?.uuid)
            await loadActivity()
        } catch {
            setError("Impossible d'uploader l'image")
        } finally {
            setLoading(false)
        }
    }, [activity?.pictures, loadActivity, uuid])

    return {
        activity,
        loading,
        error, setError,
        notFound,
        activityName, setActivityName,
        activityDescription, setActivityDescription,

        originalRates,
        draftRates, setDraftRates,
        fieldErrors,
        submitChange,
        uploadPicture
    }
}