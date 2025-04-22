import React, {JSX } from "react"

export type CardProps = {
    children: React.ReactNode
    className?: string
}

export type CardMediaProps = {
    src: string
    alt?: string
    className?: string
}

export type CardHeaderProps = {
    children: React.ReactNode
    className?: string
}

export type CardContentProps = {
    children: React.ReactNode
    className?: string
}

export type CardActionsProps = {
    children: React.ReactNode
    className?: string
}

export function Card({
    children,
    className = ""
}: CardProps): JSX.Element {
    return (
        <div className={`dashboard-card ${className}`}>
            {children}
        </div>
    )
}

export function CardMedia({
    src,
    alt,
    className = ""
}: CardMediaProps): JSX.Element {
    return (
        <div className={`dashboard-card-media ${className}`}>
            <img src={src} alt={alt || ''} />
        </div>
    )
}

export function CardHeader({
    children,
    className = ""
}: CardHeaderProps): JSX.Element {
    return (
        <div className={`dashboard-card-header ${className}`}>
            {children}
        </div>
    )
}

export function CardContent({
    children,
    className = ""
}: CardContentProps): JSX.Element {
    return (
        <div className={`dashboard-card-content ${className}`}>
            {children}
        </div>
    )
}

export function CardActions({
    children,
    className = ""
}: CardActionsProps): JSX.Element {
    return (
        <div className={`dashboard-card-actions ${className}`}>
            {children}
        </div>
    )
}