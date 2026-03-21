import { useCallback, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useModalDialog } from '../../hooks/useModalDialog'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdkwllne'

interface ContactFormModalProps {
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  type: string
  budget: string
  message: string
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  type: '',
  budget: '',
  message: '',
}

type Phase = 'input' | 'confirm' | 'sending' | 'success' | 'error'

export function ContactFormModal({ onClose }: ContactFormModalProps) {
  const { overlayRef, closeButtonRef } = useModalDialog({ onClose })
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [phase, setPhase] = useState<Phase>('input')
  const formRef = useRef<HTMLFormElement>(null)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    },
    [],
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setPhase('confirm')
    },
    [],
  )

  const handleBack = useCallback(() => {
    setPhase('input')
  }, [])

  const handleSend = useCallback(async () => {
    setPhase('sending')
    try {
      const body = new FormData()
      body.append('name', form.name)
      body.append('email', form.email)
      body.append('type', form.type)
      body.append('budget', form.budget)
      body.append('message', form.message)
      body.append('_subject', 'Works Finder Contact')

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setPhase('success')
        setForm(INITIAL_FORM)
      } else {
        setPhase('error')
      }
    } catch {
      setPhase('error')
    }
  }, [form])

  return (
    <div
      ref={overlayRef}
      className="detail-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="お問い合わせフォーム"
      onClick={handleOverlayClick}
    >
      <div className="detail-modal contact-form-modal">
        <header className="detail-modal__header">
          <div>
            <p className="section-label">Contact</p>
            <h2>お問い合わせフォーム</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="card-action card-action--secondary detail-modal__close"
            onClick={onClose}
            aria-label="閉じる"
          >
            閉じる
          </button>
        </header>

        <div className="detail-modal__body">
          {phase === 'success' ? (
            <section className="detail-modal__section">
              <p className="contact-form__status contact-form__status--success">
                送信ありがとうございました。内容を確認のうえご連絡します。
              </p>
              <button
                className="primary-button"
                type="button"
                onClick={onClose}
              >
                閉じる
              </button>
            </section>
          ) : phase === 'error' ? (
            <section className="detail-modal__section">
              <p className="contact-form__status contact-form__status--error">
                送信に失敗しました。時間をおいて再度お試しください。
              </p>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setPhase('input')}
              >
                入力画面に戻る
              </button>
            </section>
          ) : phase === 'confirm' || phase === 'sending' ? (
            <section className="detail-modal__section">
              <p className="contact-form__confirm-lead">
                以下の内容で送信します。よろしいですか？
              </p>
              <dl className="detail-modal__facts">
                <div className="detail-modal__fact">
                  <dt className="detail-modal__fact-label">お名前</dt>
                  <dd className="detail-modal__fact-value">{form.name}</dd>
                </div>
                <div className="detail-modal__fact">
                  <dt className="detail-modal__fact-label">メールアドレス</dt>
                  <dd className="detail-modal__fact-value">{form.email}</dd>
                </div>
                <div className="detail-modal__fact">
                  <dt className="detail-modal__fact-label">ご相談内容</dt>
                  <dd className="detail-modal__fact-value">{form.type}</dd>
                </div>
                {form.budget ? (
                  <div className="detail-modal__fact">
                    <dt className="detail-modal__fact-label">ご予算</dt>
                    <dd className="detail-modal__fact-value">{form.budget}</dd>
                  </div>
                ) : null}
                <div className="detail-modal__fact detail-modal__fact--wide">
                  <dt className="detail-modal__fact-label">詳細</dt>
                  <dd className="detail-modal__fact-value contact-form__message-preview">
                    {form.message}
                  </dd>
                </div>
              </dl>

              <div className="contact-form__confirm-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={handleBack}
                  disabled={phase === 'sending'}
                >
                  修正する
                </button>
                <button
                  className="primary-button"
                  type="button"
                  onClick={handleSend}
                  disabled={phase === 'sending'}
                >
                  {phase === 'sending' ? '送信中...' : 'この内容で送信'}
                </button>
              </div>
            </section>
          ) : (
            <section className="detail-modal__section">
              <form
                ref={formRef}
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <label className="contact-form__field">
                  <span>お名前</span>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                </label>

                <label className="contact-form__field">
                  <span>メールアドレス</span>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </label>

                <label className="contact-form__field">
                  <span>ご相談内容</span>
                  <select
                    name="type"
                    required
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="">選択してください</option>
                    <option>LP制作</option>
                    <option>WordPress化</option>
                    <option>既存サイト改善</option>
                    <option>その他</option>
                  </select>
                </label>

                <label className="contact-form__field">
                  <span>ご予算（任意）</span>
                  <input
                    name="budget"
                    type="text"
                    placeholder="例: 15万円〜20万円"
                    value={form.budget}
                    onChange={handleChange}
                  />
                </label>

                <label className="contact-form__field">
                  <span>詳細</span>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </label>

                <button className="primary-button" type="submit">
                  確認画面へ
                </button>

                <p className="contact-form__notice">
                  ※営業・勧誘目的のご連絡はご遠慮ください。
                </p>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
