import './MacroCard.css'

interface MacroCardProps {
  label: string
  value: number
  unit: string
  color: string
  percentage: number
}

export const MacroCard = ({
  label,
  value,
  unit,
  color,
  percentage,
}: MacroCardProps) => {
  return (
    <div className="macro-card">
      <div className="macro-card__header">
        <h3 className="macro-card__label">{label}</h3>
      </div>

      <div>
        <p
          className="macro-card__value"
          style={{ color }}
        >
          {value}
          <span className="macro-card__unit">{unit}</span>
        </p>
      </div>

      <div className="macro-card__progress-container">
        <div className="macro-card__progress-bar">
          <div
            className="macro-card__progress-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              color,
            }}
          />
        </div>
        <span className="macro-card__percentage">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}
