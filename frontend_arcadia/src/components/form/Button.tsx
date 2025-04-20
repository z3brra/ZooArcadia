import React, { JSX } from "react"
import { Link, To } from "react-router-dom"

export type ButtonVariant = 'primary' | 'secondary' | 'delete' | 'white'

type BaseButtonProps = {
    children: React.ReactNode
    icon?: React.ReactNode
    variant?: ButtonVariant
    disabled?: boolean
    className?: string
}

// Pour react-router-dom
type LinkButtonProps = BaseButtonProps & {
    to: To
    href?: never
    onClick?: never
}

// Pour utiliser un lien vers l'extérieur (wikipédia)
type AnchorButtonProps = BaseButtonProps & {
    href: string
    to?: never
    onClick?: never
    target?: React.HTMLAttributeAnchorTarget
    rel?: string
}

// Pour un boutton classique <button>
type ActionButtonProps = BaseButtonProps & {
    onClick: React.MouseEventHandler<HTMLButtonElement>
    to?: never
    href?: never
    type?: 'button' | 'submit' | 'reset'
}

export type ButtonProps = 
    | LinkButtonProps
    | AnchorButtonProps
    | ActionButtonProps

export function Button (props: ButtonProps): JSX.Element {
    const {
        children,
        icon,
        variant = 'primary',
        disabled = false,
        className = '',
    } = props

    const classes = [
        'button',
        `button-${variant}`,
        disabled ? 'button-disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    // Lien interne avec react-router-dom
    if ('to' in props) {
        return (
            <Link to={props.to} className={classes}>
                {icon && <span className="button-icon">{icon}</span>}
                <span className="button-text">{children}</span>
            </Link>
        )
    }

    if ('href' in props) {
        return (
            <a href={props.href} className={classes}>
                {icon && <span className="button-icon">{icon}</span>}
                <span className="button-text">{children}</span>
            </a>
        )
    }

    return (
        <button
          type={(props as ActionButtonProps).type ?? 'button'}
          onClick={(props as ActionButtonProps).onClick}
          disabled={disabled}
          className={classes}
        >
          {icon && <span className="button-icon">{icon}</span>}
          <span className="button-text">{children}</span>
        </button>
      )
}