interface ArchiveStat {
  label: string
  value: string
  supportingText: string
}

interface TaxonomyPreview {
  title: string
  items: string[]
}

interface HeroSectionProps {
  stats: ArchiveStat[]
  taxonomies: TaxonomyPreview[]
}

export function HeroSection({
  stats,
  taxonomies,
}: HeroSectionProps) {
  const bgImages = [
    'aoki-beauty-clinic-full.jpg',
    'aoki-tech-studio-full.jpg',
    'cafe-aoki-full.jpg',
    'aoki-mitumori-full.jpg',
    'aoki-animation-full.jpg',
  ]

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        {bgImages.map((img, i) => (
          <img
            key={img}
            className={`hero-bg__img hero-bg__img--${i + 1}`}
            src={`${import.meta.env.BASE_URL}assets/images/works/${img}`}
            alt=""
            loading="eager"
          />
        ))}
      </div>
      <div className="hero-section__overlay" />
      <div className="hero-section__layout">
        <div>
          <h1 id="hero-title">
            <span className="hero-title__main">Works</span>
            {' '}
            <span className="hero-title__accent">Finder</span>
          </h1>
          <p className="hero-section__lead">
            制作実績から、ご依頼に近い事例を見つけられます。
            <br />
            検索・絞り込み・比較で、制作の方向性を具体的にイメージしてみてください。
          </p>

          <div className="hero-section__actions">
            <a className="hero-link" href="#archive">
              作品一覧を見る
            </a>
          </div>

          <p className="hero-section__stats-inline">
            {stats.map((stat, i) => (
              <span key={stat.label}>
                {i > 0 ? <span className="hero-section__stats-sep">/</span> : null}
                <span className="hero-section__stats-num">{stat.value}</span>
                {' '}
                <span className="hero-section__stats-label">{stat.label}</span>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="taxonomy-grid">
        {taxonomies.map((taxonomy) => (
          <section className="taxonomy-card" key={taxonomy.title}>
            <h3>{taxonomy.title}</h3>
            <ul className="chip-list">
              {taxonomy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
