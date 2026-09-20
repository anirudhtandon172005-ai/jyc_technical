import Badge from './Badge'
import { formatDate } from '../../utils/formatDate'
import './LectureCard.css'

/**
 * LectureCard
 * ===========
 * Displays a single lecture entry.
 * The YouTube video opens in a new tab (reliable, accessible).
 */
export default function LectureCard({ lecture, className = '' }) {
  const {
    title,
    speaker,
    speakerRole,
    date,
    category,
    tags,
    description,
    duration,
    youtubeId,
    videoUrl
  } = lecture

  const categoryClass = category?.toLowerCase().replace('/', '-') ?? 'default'
  const hasLink = Boolean(youtubeId || videoUrl)
  
  // Decide the destination link
  let watchUrl = '#'
  if (videoUrl) {
    watchUrl = videoUrl
  } else if (youtubeId && !youtubeId.startsWith('placeholder')) {
    watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`
  }

  // Decide the thumbnail
  let thumbnailUrl = lecture.thumbnail
  if (!thumbnailUrl && youtubeId && !youtubeId.startsWith('placeholder')) {
    thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  return (
    <article className={`lecture-card ${className}`.trim()}>
      {/* Thumbnail */}
      <div className="lecture-card__thumb">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={`Thumbnail for: ${title}`}
            loading="lazy"
            className="lecture-card__thumb-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <div className="lecture-card__thumb-overlay" aria-hidden="true" />
        {duration && (
          <span className="lecture-card__duration" aria-label={`Duration: ${duration}`}>
            {duration}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="lecture-card__body">
        <div className="lecture-card__meta">
          <Badge variant={categoryClass}>{category}</Badge>
          <time
            className="lecture-card__date"
            dateTime={date}
          >
            {formatDate(date, 'short')}
          </time>
        </div>

        <h3 className="lecture-card__title">{title}</h3>
        <p className="lecture-card__desc">{description}</p>

        <div className="lecture-card__footer">
          <div className="lecture-card__speaker">
            <div className="lecture-card__speaker-avatar" aria-hidden="true">
              {speaker.charAt(0)}
            </div>
            <div>
              <div className="lecture-card__speaker-name">{speaker}</div>
              {speakerRole && (
                <div className="lecture-card__speaker-role">{speakerRole}</div>
              )}
            </div>
          </div>

          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lecture-card__watch"
            aria-label={`Watch "${title}"`}
            style={{ opacity: hasLink ? 1 : 0.5, pointerEvents: hasLink ? 'auto' : 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch
          </a>
        </div>

        {tags && tags.length > 0 && (
          <div className="lecture-card__tags">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="lecture-card__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
