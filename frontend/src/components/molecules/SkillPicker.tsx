import { useState } from 'react'
import { TextInput } from '@/components/atoms'
import { SKILL_OPTIONS } from '@/data/workItems'

export function SkillPicker({ skills, disabled, onChange }: {
  skills: string[]
  disabled?: boolean
  onChange: (skills: string[]) => void
}) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = SKILL_OPTIONS.filter(
    option => option.toLowerCase().includes(input.toLowerCase()) && !skills.includes(option),
  ).slice(0, 6)

  function add(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed)) onChange([...skills, trimmed])
    setInput('')
    setShowSuggestions(false)
  }

  return (
    <>
      <div className="relative">
        <TextInput
          type="text"
          value={input}
          disabled={disabled}
          onChange={event => {
            setInput(event.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add(input)
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Type a skill and press Enter, or select from suggestions"
          aria-label="Add a skill"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-line bg-white shadow-lg">
            {suggestions.map(option => (
              <button
                key={option}
                type="button"
                onMouseDown={() => add(option)}
                className="w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface-muted"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={skill}
              className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white"
            >
              {skill}
              <button
                type="button"
                aria-label={`Remove ${skill}`}
                onClick={() => onChange(skills.filter(entry => entry !== skill))}
                className="text-white/60 transition-colors hover:text-white"
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M9 3L3 9M3 3l6 6" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  )
}
